const testController = (req, res) => {
    res.status(200).send({
        message: 'test rout setup',
        success: true,
    });
};

module.exports = { testController };