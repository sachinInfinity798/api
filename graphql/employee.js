var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');

var emparrobjlist = [
    { _id: "5e995f7126b0af6c35ba09f1", Name: "Pankaj kumar", Address: "Flat no 101 Sec 50", DOB: new Date("1985-03-29T01:55:13.531Z"), Gender: "Male", City: "Mumbai", Email: "pankajkumar@gmail.com", Mobile: "8888888888" },
    { _id: "5e995f8626b0af6c35ba09f2", Name: "Pramod Kumar", Address: "Flat no 202 Sec 35", DOB: new Date("1982-04-14T01:55:13.531Z"), Gender: "Male", City: "Delhi", Email: "pramodkumar@gmail.com", Mobile: "7777777777" },
    { _id: "5e995f9726b0af6c35ba09f3", Name: "Pooja Kumari", Address: "Flat no 303 Sec 73", DOB: new Date("1988-03-17T01:55:13.531Z"), Gender: "Female", City: "Meerut", Email: "pooja@gmail.com", Mobile: "9999999999" },
    { _id: "5e995f9726b0af6c35ba09f4", Name: "Sanjeev Singh", Address: "Flat no 404 Sec 145", DOB: new Date("1992-03-06T01:55:13.531Z"), Gender: "Male", City: "Shimla", Email: "sanjeev@gmail.com", Mobile: "1111111111" }
];

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
var listCountType = new GraphQLObjectType({
    name: 'count',
    fields: function () {
        return {
            _id: {
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
                    if (!emparrobjlist) {
                        throw new Error('Error')
                    }

                    return emparrobjlist;
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
                    var filtered = emparrobjlist.filter(function (el) {
                        return el._id === params.id;
                    });
                    console.log('filtered', filtered);
                    if (!filtered) {
                        throw new Error('Error')
                    }
                    return filtered[0];
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
                        type: GraphQLString
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
                    let addobj = {};
                    addobj = params;
                    let randomstring = Math.random().toString(36).slice(-8);
                    addobj._id = randomstring;
                    emparrobjlist.unshift(addobj);
                    if (!addobj) {
                        throw new Error('Error');
                    }
                    return addobj;
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
                        type: GraphQLString
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
                    let updatedobj = {};
                    let Id = params.id;
                    delete params.id;
                    updatedobj = params;

                    let index = emparrobjlist.findIndex(a => a._id == Id);
                    updatedobj['_id'] = Id;
                    emparrobjlist[index] = updatedobj;
                    if (!updatedobj) {
                        throw new Error('Error');
                    }
                    return updatedobj;
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
                    let index = emparrobjlist.findIndex(a => a._id == params.id);
                    if (index > -1) { emparrobjlist.splice(index, 1); }
                    return emparrobjlist[index];
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });