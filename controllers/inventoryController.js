const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");


//Create Inventory
const createInventoryController = async (req, res) => {
    try {
        //destructure element from request.body
        const { email } = req.body;
        //validation 
        const user = await userModel.findOne({ email })
        if (!user) {
            throw new Error("User not found")
        }
        // if (inventoryType === "In" && user.role !== "donar") {
        //     throw new Error("Not a donar account")
        // }
        // if (inventoryType === "Out" && user.role !== "hospital") {
        //     throw new Error("Not a hospital")
        // }

        //When blood request OUT
        if (req.body.inventoryType == "Out") {
            const requestedBloodGroup = req.body.bloodGroup;
            const requestedQuantityOfBlood = req.body.quantity;
            const organization = new mongoose.Types.ObjectId(req.body.userId);
            //Calculate blood quantity: IN
            const totalInOfRequestedBlood = await inventoryModel.aggregate([
                {
                    $match: {
                        organization,
                        inventoryType: "In",
                        bloodGroup: requestedBloodGroup
                    }
                },
                {
                    $group: {
                        _id: '$bloodGroup',
                        total: { $sum: '$quantity' }
                    }
                }
            ])
            // console.log("Total In:", totalInOfRequestedBlood);
            const totalIn = totalInOfRequestedBlood[0]?.total || 0;
            //Calculate blood quantity: OUT
            const totalOutOfRequestedBlood = await inventoryModel.aggregate([
                {
                    $match: {
                        organization,
                        inventoryType: "Out",
                        bloodGroup: requestedBloodGroup
                    }
                },
                {
                    $group: {
                        _id: '$bloodGroup',
                        total: { $sum: '$quantity' }
                    }
                }
            ])
            const totalOut = totalOutOfRequestedBlood[0]?.total || 0;

            // Total In & Out Calculation
            const availableQuantityOfBlood = totalIn - totalOut;

            //Quantity Validation
            if (availableQuantityOfBlood < requestedQuantityOfBlood) {
                return res.status(500).send({
                    success: false,
                    message: `Only ${availableQuantityOfBlood} ML of ${requestedBloodGroup.toUpperCase()} is available`
                })
            }
            req.body.hospital = user?._id;

        } else {
            req.body.donar = user?._id;
        }
        //Save inventory record
        const inventory = new inventoryModel(req.body)
        await inventory.save();
        return res.status(201).send({
            success: true,
            message: "New Blood Record Added"
        })
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Create Inventory API",
            error
        })
    }
}

//Get Inventory: Get all blood records
const getInventoryController = async (req, res) => {
    try {
        const inventory = await inventoryModel.find({ organization: req.body.userId })
            .populate('donar')
            .populate('hospital')
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "Get all inventory records successfully",
            inventory
        })
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in get all Inventory",
            error
        })
    }
}
//Get Inventory: Get Hospital blood records
const getInventoryHospitalController = async (req, res) => {
    try {
        const inventory = await inventoryModel.find(req.body.filters)
            .populate('donar')
            .populate('hospital')
            .populate('organization')
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "Get hospital consumer records successfully",
            inventory
        })
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in get consumer Inventory",
            error
        })
    }
}
//For Analytics: Get recent 3 records from all blood records to show in analytics page
const getRecentInventoryController = async (req, res) => {
    try {
        const inventory = await inventoryModel.find({ organization: req.body.userId }).limit(3).sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "Recent Inventory Data",
            inventory,
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Recent Inventory API",
            error,
        });
    }
};

// Get Donar: Get all donar records
const getDonarController = async (req, res) => {
    try {
        const organization = req.body.userId
        //Find donar
        const donarId = await inventoryModel.distinct("donar", {
            organization,
        });
        // console.log(donarId)
        const donar = await userModel.find({ _id: { $in: donarId } });
        return res.status(200).send({
            success: true,
            message: "Donar records Fetched successfully",
            donar
        })
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Donar Records',
            error
        })
    }
}

// Hospital Controller
const getHospitalController = async (req, res) => {
    try {
        //get organization ID
        const organization = req.body.userId;
        //get hospital ID
        const hospitalId = await inventoryModel.distinct('hospital', { organization });
        //Find hospital
        const hospital = await userModel.find({
            _id: { $in: hospitalId }
        })
        return res.status(200).send({
            success: true,
            message: "Hospital data Fetch Successfully",
            hospital
        })
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in get Hospital API',
            error
        })
    }
}

// Organization Controller
const getOrganizationController = async (req, res) => {
    try {
        //get donar ID
        const donar = req.body.userId;
        //get organization ID
        const orgId = await inventoryModel.distinct('organization', { donar });
        //Find organization
        const organization = await userModel.find({
            _id: { $in: orgId }
        })
        return res.status(200).send({
            success: true,
            message: 'Organization data Fetch successfully',
            organization
        })
    } catch (error) {
        // console.log(error);
        return res.status(5000).send({
            success: false,
            message: 'Error in get organization API',
            error
        })
    }
}
// Organization for hospital Controller
const getOrganizationForHospitalController = async (req, res) => {
    try {
        //get donar ID
        const hospital = req.body.userId;
        //get organization ID
        const orgId = await inventoryModel.distinct('organization', { hospital });
        //Find organization
        const organization = await userModel.find({
            _id: { $in: orgId }
        })
        return res.status(200).send({
            success: true,
            message: 'Organization for hospital data Fetch successfully',
            organization
        })
    } catch (error) {
        // console.log(error);
        return res.status(5000).send({
            success: false,
            message: 'Error in get organization-Hospital API',
            error
        })
    }
}

module.exports = {
    createInventoryController,
    getInventoryController,
    getDonarController,
    getHospitalController,
    getOrganizationController,
    getOrganizationForHospitalController,
    getInventoryHospitalController,
    getRecentInventoryController
};