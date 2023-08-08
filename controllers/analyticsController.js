const mongoose = require("mongoose");
//Get blood data
const inventoryModel = require("../models/inventoryModel");

const bloodGroupDetailsController = async (req, res) => {
    try {
        const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
        const bloodGroupData = [];
        const organization = new mongoose.Types.ObjectId(req.body.userId);
        //get single blood group
        await Promise.all(bloodGroups.map(async (bloodGroup) => {
            //count total: In
            const totalIn = await inventoryModel.aggregate([
                {
                    $match: {
                        bloodGroup: bloodGroup,
                        inventoryType: "In",
                        organization
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$quantity' }
                    }
                },
            ]);
            //count total: Out
            const totalOut = await inventoryModel.aggregate([
                {
                    $match: {
                        bloodGroup: bloodGroup,
                        inventoryType: "Out",
                        organization
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$quantity' }
                    }
                },
            ]);
            //Calculate Total
            const availableBlood = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);
            //Push data in blood group array
            bloodGroupData.push({
                bloodGroup,
                totalIn: totalIn[0]?.total || 0,
                totalOut: totalOut[0]?.total || 0,
                availableBlood
            })
        }))
        return res.status(200).send({
            success: true,
            message: "Blood group data fetch successfully",
            bloodGroupData
        })
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in blood group data Analytics API",
            error
        })
    }
}

module.exports = { bloodGroupDetailsController }