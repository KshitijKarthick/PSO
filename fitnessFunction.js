function fitnessFunction(list){
  if(Array.isArray(list)){
    return rastriginFunction(list);
  }
  else
    console.log("Input for Fitness Function Invalid");
}

function rastriginFunction(list){
  var solution=10*list.length;
  var sum=0
  for (var i=0;i<list.length;i++){
    item=list[i]
    sum+=((item*item)-(10*Math.cos(2*Math.PI*item)));
  }
  return solution+sum;
}
