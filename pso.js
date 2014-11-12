// fitnessFunction
// n dimension
// minimax is the lower and upper bound of the n dimensions space.
//
function random_Vector(minmax){
	if(Array.isArray(minmax)){
    	var randVector=[];
    	for(var i=0;i<minmax.length;i++){
    		randVector[i]=minmax[i][0]+(minmax[i][1]-minmax[i][0])*Math.random();
    	}
    return randVector;
  }
  else
    console.log("Input for randomVector Invalid");
}

function create_Particle(searchSpace,velocitySpace){
	if(Array.isArray(searchSpace) && Array.isArray(velocitySpace)){
    	var particle={};
    	particle['position']=random_Vector(searchSpace);
    	particle['cost']=fitnessFunction(particle['position']);
      particle['b_position']=[]
      for(var i=0;i<particle['position'].length;i++){
    	   particle['b_position'][i]=particle['position'][i];
      }
    	particle['b_cost']=particle['cost'];
    	particle['velocity']=random_Vector(velocitySpace);
      return particle
  }
  else
    console.log("Input for createParticle Invalid");
}

function get_global_best(population,current_best){
  if(current_best==undefined)
    current_best=null
  // apply sort for population
	console.log("Before Sorting")
  for(var i=0;i<population.length;i++)
	 console.log(population[i])
  population.sort(function(x,y){
		if(minimise){
			return x['cost']-y['cost']
		}
		else{
			return y['cost']-x['cost']
		}
	})
	console.log("After Sorting")
	for(var i=0;i<population.length;i++)
   console.log(population[i])
  best=population[0]
  if(current_best==undefined || best['cost'] <= current_best['cost']){
    current_best={}
    //current_best['position']=Array.new(best['position'])
    current_best['position']=[]
    for(var i=0;i<best['position'].length;i++){
      current_best['position'][i]=best['position'][i]
    }
    current_best['cost']=best['cost']
  }
  console.log("Current Best")
	console.log(current_best)
  return current_best
}

function update_velocity(particle,gbest,max_v,c1,c2){
  for(var i=0;i<particle['velocity'].length;i++){
    v1=c1*Math.random()*(particle['b_position'][i]-particle['position'][i])
    v2=c2*Math.random()*(gbest['position'][i]-particle['position'][i])
    particle['velocity'][i]=particle['velocity'][i]+v1+v2
    if(particle['velocity'][i]>max_v)
      particle['velocity'][i]=max_v
    if(particle['velocity'][i]< -max_v)
      particle['velocity'][i]= -max_v
  }
}

function update_position(part,bounds){
  for(var i=0;i<part['position'].length;i++){
    part['position'][i]+=part['velocity'][i]
    if(part['position'][i]>bounds[i][1]){
      part['position'][i]=bounds[i][1]-Math.abs(part['position'][i]-bounds[i][1])
      part['velocity'][i]*=-1.0
    }
    else if(part['position'][i]<bounds[i][0])
    {
      part['position'][i]=bounds[i][0]+Math.abs(part['position'][i]-bounds[i][0])
      part['velocity'][i]*=-1.0
    }
  }
}

function update_best_position(particle){
  if(particle['cost']>particle['b_cost'])
    return
  particle['b_cost']=particle['cost']
  particle['b_position']=particle['position']
}

function search(max_gens,search_space,vel_space,pop_size,max_vel,c1,c2){
  pop=[]
  for(var i=0;i<pop_size;i++)
  {
    pop[i]=create_Particle(search_space,vel_space)
  }
  gbest=get_global_best(pop)
  for(var i=0;i<max_gens;i++){
    for(var j=0;j<pop.length;j++){
      update_velocity(pop[j],gbest,max_vel,c1,c2)
      update_position(pop[j],search_space)
      pop[j]['cost']=fitnessFunction(pop[j]['position'])
      update_best_position(pop[j])
    }
    gbest=get_global_best(pop,gbest)
    printToBox(" > Generation No : "+(i+1).toString()+" , Fitness Value : "+gbest['cost'].toString())
    //console.log(" > Gen : %d , Fitness : %f",i+1,gbest['cost'])
  }
  return gbest
}

function configuration(params){
  problem_size=2
  upper_Dimension_Bound=5
  lower_Dimension_Bound=-5
  upper_Velocity_Bound=1
  lower_Velocity_Bound=-1
  search_space=Array(problem_size)
  vel_space=Array(problem_size)
  for(var i=0;i<search_space.length;i++){
    search_space[i]=[lower_Dimension_Bound,upper_Dimension_Bound]
    vel_space[i]=[lower_Velocity_Bound,upper_Velocity_Bound]
  }
  max_gens=params['generations']
  pop_size=params['particles']
  max_vel=params['velocity-limit']
	minimise=params['min']
  c1=2.0
  c2=2.0
  best=search(max_gens,search_space,vel_space,pop_size,max_vel,c1,c2)
  printToBox("")
  printToBox("Done! Fitness value: "+best['cost'].toString() + " , Position:"+best['position'].toString())
  //console.log("Done ! Solution: Fitness Value:%f Position :",best['cost'])
  //console.log(best['position'])

}

function getParams(){
	params={}
	params['generations']=Number(document.getElementById("gens").value)
	params['velocity-limit']=Number(document.getElementById("vel").value)
	params['particles']=Number(document.getElementById("part").value)
	return params
}
function min(){
	box.innerHTML=""
	params=getParams();
	params['min']=true
	configuration(params);
}

function max(){
	box.innerHTML=""
	params=getParams();
	params['min']=false
	configuration(params);
}

function printToBox(str){
  box.innerHTML+="<br>"+str;
}

minimise=null
box="blah"
window.onload=function(){box=document.getElementById("text-box")}
