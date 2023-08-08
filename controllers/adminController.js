const userModel = require("../models/userModel");

//Get Donar List
const getDonarListController = async (req, res) => {
    try {
        const donarData = await userModel.find({ role: "donar" }).sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            TotalCount: donarData.length,
            message: "Donar list fetch successfully",
            donarData
        })
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in donar list API",
            error
        })
    }
};

//Get Hospital List
const getHospitalListController = async (req, res) => {
    try {
        const hospitalData = await userModel.find({ role: "hospital" }).sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            TotalCount: hospitalData.length,
            message: "Hospital list fetch successfully",
            hospitalData
        })
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in hospital list API",
            error
        })
    }
};

//Get Organization List
const getOrganizationListController = async (req, res) => {
    try {
        const orgData = await userModel.find({ role: "organization" }).sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            TotalCount: orgData.length,
            message: "Organization list fetch successfully",
            orgData
        })
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in organization list API",
            error
        })
    }
};

// Admin Action Operation

// Delete Donar
const deleteDonarController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success: true,
            message: "Donar record deleted successfully"
        })
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while deleting donar",
            error
        })
    }
};

// Delete Hospital
const deleteHospitalController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success: true,
            message: "Hospital record deleted successfully"
        })
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while deleting hospital",
            error
        })
    }
};

// Delete Organization
const deleteOrgController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success: true,
            message: "Organization record deleted successfully"
        })
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while deleting organization",
            error
        })
    }
};


module.exports = {
    getDonarListController,
    getHospitalListController,
    getOrganizationListController,
    deleteDonarController,
    deleteHospitalController,
    deleteOrgController
}