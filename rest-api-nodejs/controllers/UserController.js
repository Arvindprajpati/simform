const User = require("../models/UserModel");
const {
	body,
	validationResult
} = require("express-validator");
const {
	sanitizeBody
} = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
	upload
} = require("../helpers/imageUpload");
// User Schema
function UserData(data) {
	this.id = data._id;
	this.firstName = data.firstName;
	this.lastName = data.lastName;
	this.email = data.email;
	this.createdAt = data.createdAt;
	this.updatedAt = data.updatedAt;
	this.profileImageUrl = data.profileImageUrl;
}

/**
 * User List.
 * 
 * @returns {Object}
 */
exports.userList = [
	auth,
	function (req, res) {
		try {
			User.find({
				user: req.user._id
			}).then((users) => {
				return apiResponse.successResponseWithData(res, "Operation success", (users || []).map(d => new UserData(d)));
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * User Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.userDetail = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			User.findOne({
				_id: req.params.id
			}).then((user) => {
				if (user !== null) {
					let userData = new UserData(user);
					return apiResponse.successResponseWithData(res, "Operation success", userData);
				} else {
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * User update.
 * 
 * @param {string}      firstName 
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 * @param {string}      profileImageUrl
 * @returns {Object}
 */
exports.userUpdate = [
	auth,
	// Validate fields.
	body("firstName").isLength({
		min: 1
	}).trim().withMessage("First name must be specified.")
	.isAlphanumeric().withMessage("First name has non-alphanumeric characters."),
	body("lastName").isLength({
		min: 1
	}).trim().withMessage("Last name must be specified.")
	.isAlphanumeric().withMessage("Last name has non-alphanumeric characters."),
	body("email").isLength({
		min: 1
	}).trim().withMessage("Email must be specified.")
	.isEmail().withMessage("Email must be a valid email address.").custom((value, {
		req,
		location,
		path
	}) => {
		return User.findOne({
			email: value,
			_id: {
				$ne: req.user._id
			}
		}).then((user) => {
			if (user) {
				return Promise.reject("E-mail already in use");
			}
		});
	}),
	body("password").isLength({
		min: 6
	}).trim().withMessage("Password must be 6 characters or greater."),
	// Sanitize fields.
	sanitizeBody("firstName").escape(),
	sanitizeBody("lastName").escape(),
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {

				bcrypt.hash(req.body.password, 10, function (err, hash) {

					var user = new UserData({
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						email: req.body.email,
						password: hash,
						profileImageUrl: req.body.profileImageUrl,
						_id: req.params.id
					});

					if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
						return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
					} else {
						User.findById(req.params.id, function (err, foundUser) {
							if (foundUser === null) {
								return apiResponse.notFoundResponse(res, "User not exists with this id");
							} else {
								//Check authorized user
								if (foundUser._id.toString() !== req.user._id) {
									return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
								} else {
									//update user.
									User.findByIdAndUpdate(req.params.id, user, {}, function (err) {
										if (err) {
											return apiResponse.ErrorResponse(res, err);
										} else {
											let userData = new UserData(user);
											return apiResponse.successResponseWithData(res, "User update Success.", userData);
										}
									});
								}
							}
						});
					}
				})
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * User Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.userDelete = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			User.findById(req.params.id, function (err, found) {
				if (found === null) {
					return apiResponse.notFoundResponse(res, "User not exists with this id");
				} else {
					//Check authorized user
					if (found._id.toString() !== req.user._id) {
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					} else {
						//delete user.
						User.findByIdAndRemove(req.params.id, function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							} else {
								return apiResponse.successResponse(res, "User delete Success.");
							}
						});
					}
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * User profile image upload.
 *  
 * 
 * @returns {Object}
 */
exports.userProfileImageUpload = [
	auth,
	function (req, res) {
		try {
			User.findById(req.user._id, function (err, found) {
				if (found === null) {
					return apiResponse.notFoundResponse(res, "User not exists with this id");
				} else {
					upload(req, (url) => {
						console.log(url);
						User.updateOne(req.params.id, {
							profileImageUrl: url
						}, function (err, updateUser) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							} else {
								found.profileImageUrl = url;
								let userData = new UserData(found);
								return apiResponse.successResponseWithData(res, "User profile image update Success.", userData);
							}
						});
					})

				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];