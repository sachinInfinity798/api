var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
//var GraphQLNumber = require('graphql-number');
var GraphQLDate = require('graphql-date');

var EmployeeModel = require('../models/employeeSchema');

var cityarray = [{ Name: 'Noida' }, { Name: 'Delhi' }, { Name: 'Pune' }, { Name: 'Mumbai' }, { Name: 'Agra' }, { Name: 'Meerut' }, { Name: 'Shimla' }]
var cityType = new GraphQLObjectType({
    name: 'city',
    fields: function () {
        return {
            Name: {
                type: GraphQLString
            }
        }
    }
})
var employeeType = new GraphQLObjectType({
    name: 'employee',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            Name: {
                type: GraphQLString
            },
            Address: {
                type: GraphQLString
            },
            DOB: {
                type: GraphQLDate
            },
            Gender: {
                type: GraphQLString
            },
            City: {
                type: GraphQLString
            },
            Mobile: {
                type: GraphQLID
            },
            Email: {
                type: GraphQLString
            }
        }
    }
});


var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
        return {
            listemployees: {
                type: new GraphQLList(employeeType),
                totalCount: EmployeeModel.count().exec(),
                args: {
                    first: {
                        name: "first",
                        type: GraphQLInt
                    },
                    limit: {
                        name: "limit",
                        type: GraphQLInt
                    }
                },
                resolve: function (root, params) {
                    console.log('params', params);
                    const lists = EmployeeModel.find().limit(params.limit).skip(params.first).exec()
                    if (!lists) {
                        throw new Error('Error')
                    }

                    return lists;
                }
            },
            employee: {
                type: employeeType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const employeeDetail = EmployeeModel.findById(params.id).exec()
                    if (!employeeDetail) {
                        throw new Error('Error')
                    }
                    return employeeDetail
                }
            },
            citylist: {
                type: new GraphQLList(cityType),
                resolve: function () {

                    if (!cityarray) {
                        throw new Error('Error')
                    }
                    return cityarray
                }
            }
        }
    }
});



var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
        return {
            addEmployee: {
                type: employeeType,
                args: {
                    Name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    Address: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    DOB: {
                        type: new GraphQLNonNull(GraphQLDate)
                    },
                    Gender: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    City: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    Mobile: {
                        type: new GraphQLNonNull(GraphQLID)
                    },
                    Email: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function (root, params) {
                    const empModel = new EmployeeModel(params);
                    const Employee = empModel.save();
                    if (!Employee) {
                        throw new Error('Error');
                    }
                    return Employee
                }
            },
            updateEmployee: {
                type: employeeType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    Name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    Address: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    DOB: {
                        type: new GraphQLNonNull(GraphQLDate)
                    },
                    Gender: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    City: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    Mobile: {
                        type: new GraphQLNonNull(GraphQLID)
                    },
                    Email: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    return EmployeeModel.findByIdAndUpdate(params.id, { Name: params.Name, Address: params.Address, DOB: params.DOB, Gender: params.Gender, City: params.City, Mobile: params.Mobile, Email: params.Email }, function (err) {
                        if (err) return next(err);
                    });
                }
            },
            deleteEmployee: {
                type: employeeType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const delemp = EmployeeModel.findByIdAndRemove(params.id).exec();
                    if (!delemp) {
                        throw new Error('Error')
                    }
                    return delemp;
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });