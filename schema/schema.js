const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLFloat, GraphQLSchema} = require("graphql");
const { db } = require("../model/Player");

const Player = require("../model/Player")
const Team = require("../model/Team");

//PLAYER TYPE
const PlayerType = new GraphQLObjectType({
    name: "player",
    fields:()=>({
        id:{type: GraphQLID},
        name:{type: GraphQLString},
        about:{type: GraphQLString},
        country:{type: GraphQLString},
        salary:{type: GraphQLInt},  
        height:{type: GraphQLFloat},
        brithDate:{type: GraphQLString},
        logo:{type: GraphQLString},
        coverImage:{type: GraphQLString},
        teamId:{type: GraphQLID},
        team:{
            type: TeamType,
            resolve(parent, ages){
                return Team.findById(parent.teamId);
           }
        }
    })
});

//TEAM TYPE
const TeamType = new GraphQLObjectType({
    name:"team",
    fields:()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        about: {type: GraphQLString},
        totalCost: {
            type: GraphQLInt,
            resolve(parent, args){     
                const teamCost = async()=>{
                    const players =  await Player.find({teamId: parent.id});
                    let totalSum = 0;   
                    totalSum = players.map(player=> player.salary).reduce((asumulator, salary)=>{
                        return asumulator + salary;
                    },0) 
                    return totalSum;
                }
                
                return teamCost().then(data=>{
                    return data;
                })
            }
        },
        establish: {type: GraphQLString},
        logo: {type: GraphQLString},
        coverImage: {type: GraphQLString}, 
        players:{
            type: GraphQLList(PlayerType),
        
            resolve(parent, args){      
                return Player.find({teamId: parent.id});
            }
        }     
 
    })
});


//TOOT QUERY
const RootQuery = new GraphQLObjectType({
    name:"rootQuery",
    fields:{
        teams:{
            type: GraphQLList(TeamType),
            resolve(parent,ares){
                return Team.find();
            }
        },
        team:{
            type:TeamType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Team.findById(args.id);
            }
        },
        players:{
            type: GraphQLList(PlayerType),
            resolve(parent,ares){
                return Player.find();
            }
        },
        player:{
            type: PlayerType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Player.findById(args.id);
            }
        }
    }
})

//MUTATION QUREY
const Mutation = new GraphQLObjectType({
    name:"mutation",
    fields:{
        //ADD TEAM
        addTeam:{
            type: TeamType,
            args:{
                name: {type: GraphQLNonNull(GraphQLString)},
                about: {type: GraphQLNonNull(GraphQLString)},
                totalCost: {type: GraphQLNonNull(GraphQLInt)},
                establish: {type: GraphQLNonNull(GraphQLString)},
                logo: {type: GraphQLNonNull(GraphQLString)},
                coverImage: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args){
                const team = new Team({
                    name: args.name,
                    about: args.about,
                    totalCost:  args.totalCost,
                    establish: args.establish, 
                    logo: args.logo,
                    coverImage: args.coverImage,
                })
                return team.save();
            }   
        },

        //UPDATE TEAM
        updateTeam:{
            type: TeamType,
            args:{
                id:{type: GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLString},
                about: {type: GraphQLString},
                establish: {type: GraphQLString},
                logo: {type: GraphQLString},
                coverImage: {type: GraphQLString},
            },
            resolve(parent, args){
                const team = {
                    name: args.name,
                    about: args.about,
                    establish: args.establish, 
                    logo: args.logo,
                    coverImage: args.coverImage,
                }

                return Team.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{          
                            ...team
                        }
                    },
                    {
                        new: true
                    }
                );
            }   
        },

        //DELETE TEAM
        deleteTeam:{
            type:TeamType,
            args:{id:{type: GraphQLNonNull(GraphQLID)}},
            resolve(parent, args){                
                return Team.findByIdAndDelete(args.id);
            }
        },

        //ADD PLAYER
        addPlayer:{
            type: PlayerType,  
            args:{
                name: {type: GraphQLNonNull(GraphQLString)},
                about: {type: GraphQLNonNull(GraphQLString)},
                country: {type: GraphQLNonNull(GraphQLString)},
                height: {type: GraphQLNonNull(GraphQLFloat)},
                salary:{type: GraphQLNonNull(GraphQLInt)},
                brithDate: {type: GraphQLNonNull(GraphQLString)},
                teamId:{type:GraphQLNonNull(GraphQLID)},
                logo: {type: GraphQLNonNull(GraphQLString)},
                coverImage: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args){
                const player = new Player({
                    name: args.name,
                    about: args.about,
                    country: args.country,
                    height: args.height,
                    salary: args.salary,
                    brithDate: args.brithDate,
                    teamId: args.teamId,
                    logo: args.logo,
                    coverImage: args.coverImage,
                });
                
                return player.save();
            }
        },
        //UPDATE PLAYER
        updatePlayer:{
            type: PlayerType,  
            args:{
                id: {type: GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLString},
                about: {type: GraphQLString},
                country: {type: GraphQLString},
                height: {type: GraphQLFloat},
                salary:{type: GraphQLInt},
                brithDate: {type: GraphQLString},
                teamId:{type:GraphQLID},
                logo: {type: GraphQLString},
                coverImage: {type: GraphQLString},
            },
            resolve(parent, args){
                const player = {
                    name: args.name,
                    about: args.about,
                    country: args.country,
                    height: args.height,
                    salary: args.salary,
                    brithDate: args.brithDate,
                    teamId: args.teamId,
                    logo: args.logo,
                    coverImage: args.coverImage,
                }

                return Player.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            ...player
                        }
                    },
                    {
                        new:true
                    }
                );
            }
        },
        //DELETE PLAYER
        deletePlayer:{
            type: PlayerType,
            args:{id:{type: GraphQLNonNull(GraphQLID)}},
            resolve(parent, args){
                return Player.findByIdAndDelete(args.id);
            }
        }
    }
})     

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})