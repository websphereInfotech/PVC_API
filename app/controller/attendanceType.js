const AttendanceType = require("../models/attendanceType");
const { Sequelize, Op } = require("sequelize");

/*=============================================================================================================
                                          CRUD API for Attendance Type
 ============================================================================================================ */

/** POST: Create new attendance type */
exports.create_attendance_type = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { code, description, salaryPerDay } = req.body;

        // Validate required fields
        if (!code || !salaryPerDay) {
            return res.status(400).json({
                status: "false",
                message: "Code and salary per day are required fields"
            });
        }

        // Check if attendance type with same code already exists
        const existingType = await AttendanceType.findOne({
            where: {
                companyId,
                code: code.toUpperCase()
            }
        });

        if (existingType) {
            return res.status(409).json({
                status: "false",
                message: "Attendance type with this code already exists"
            });
        }

        const attendanceType = await AttendanceType.create({
            companyId,
            code: code.toUpperCase(),
            description,
            salaryPerDay
        });

        return res.status(201).json({
            status: "true",
            message: "Attendance type created successfully",
            data: attendanceType
        });
    } catch (error) {
        console.error("Error creating attendance type:", error);
        return res.status(500).json({
            status: "false",
            message: "Internal Server Error"
        });
    }
};

/** GET: Get all attendance types */
exports.get_all_attendance_types = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { page, limit, search } = req.query;

        const whereClause = { companyId };

        // Add search functionality
        if (search) {
            whereClause[Op.or] = [
                { code: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        // Check if pagination is requested
        if (page && limit) {
            const offset = (parseInt(page) - 1) * parseInt(limit);
            
            const { count, rows } = await AttendanceType.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: offset,
                order: [['createdAt', 'DESC']]
            });

            return res.status(200).json({
                status: "true",
                message: "Attendance types retrieved successfully",
                data: {
                    attendanceTypes: rows,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(count / parseInt(limit)),
                        totalItems: count,
                        itemsPerPage: parseInt(limit)
                    }
                }
            });
        } else {
            // Return all results without pagination
            const attendanceTypes = await AttendanceType.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']]
            });

            return res.status(200).json({
                status: "true",
                message: "Attendance types retrieved successfully",
                data: {
                    attendanceTypes: attendanceTypes,
                    totalItems: attendanceTypes.length
                }
            });
        }
    } catch (error) {
        console.error("Error fetching attendance types:", error);
        return res.status(500).json({
            status: "false",
            message: "Internal Server Error"
        });
    }
};

/** GET: Get attendance type by ID */
exports.get_attendance_type_by_id = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { id } = req.params;

        const attendanceType = await AttendanceType.findOne({
            where: {
                id,
                companyId
            }
        });

        if (!attendanceType) {
            return res.status(404).json({
                status: "false",
                message: "Attendance type not found"
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Attendance type retrieved successfully",
            data: attendanceType
        });
    } catch (error) {
        console.error("Error fetching attendance type:", error);
        return res.status(500).json({
            status: "false",
            message: "Internal Server Error"
        });
    }
};

/** PUT: Update attendance type */
exports.update_attendance_type = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { id } = req.params;
        const { code, description, salaryPerDay } = req.body;

        // Validate required fields
        if (!code || !salaryPerDay) {
            return res.status(400).json({
                status: "false",
                message: "Code and salary per day are required fields"
            });
        }

        // Check if attendance type exists
        const existingType = await AttendanceType.findOne({
            where: {
                id,
                companyId
            }
        });

        if (!existingType) {
            return res.status(404).json({
                status: "false",
                message: "Attendance type not found"
            });
        }

        // Check if code is already used by another attendance type
        const duplicateCode = await AttendanceType.findOne({
            where: {
                companyId,
                code: code.toUpperCase(),
                id: { [Op.ne]: id }
            }
        });

        if (duplicateCode) {
            return res.status(409).json({
                status: "false",
                message: "Attendance type with this code already exists"
            });
        }

        // Update attendance type
        await AttendanceType.update(
            {
                code: code.toUpperCase(),
                description,
                salaryPerDay
            },
            {
                where: {
                    id,
                    companyId
                }
            }
        );

        // Get updated attendance type
        const updatedType = await AttendanceType.findOne({
            where: {
                id,
                companyId
            }
        });

        return res.status(200).json({
            status: "true",
            message: "Attendance type updated successfully",
            data: updatedType
        });
    } catch (error) {
        console.error("Error updating attendance type:", error);
        return res.status(500).json({
            status: "false",
            message: "Internal Server Error"
        });
    }
};

/** DELETE: Delete attendance type */
exports.delete_attendance_type = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { id } = req.params;

        // Check if attendance type exists
        const attendanceType = await AttendanceType.findOne({
            where: {
                id,
                companyId
            }
        });

        if (!attendanceType) {
            return res.status(404).json({
                status: "false",
                message: "Attendance type not found"
            });
        }

        // Check if attendance type is being used (you can add more checks here)
        // For example, check if it's referenced in attendance records

        // Delete attendance type
        await AttendanceType.destroy({
            where: {
                id,
                companyId
            }
        });

        return res.status(200).json({
            status: "true",
            message: "Attendance type deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting attendance type:", error);
        return res.status(500).json({
            status: "false",
            message: "Internal Server Error"
        });
    }
};

/** GET: Get attendance types for dropdown */
exports.get_attendance_types_dropdown = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        const attendanceTypes = await AttendanceType.findAll({
            where: { companyId },
            attributes: ['id', 'code', 'description', 'salaryPerDay'],
            order: [['code', 'ASC']]
        });

        return res.status(200).json({
            status: "true",
            message: "Attendance types retrieved successfully",
            data: attendanceTypes
        });
    } catch (error) {
        console.error("Error fetching attendance types dropdown:", error);
        return res.status(500).json({
            status: "false",
            message: "Internal Server Error"
        });
    }
};
