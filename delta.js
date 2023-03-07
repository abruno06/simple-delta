"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = exports.delta = void 0;
module.exports = exports = main;
exports.default = main;
function main() {
	if (arguments.length != 2 ) return null
    return delta.apply( arguments[0],arguments[1]);
}
exports.main = main;
main.delta = delta;



function isPlainObject(input) {
    return input && typeof input === 'object' && !Array.isArray(input);
}
main.isPlainObject = isPlainObject;

function clone(input) {
	//console.log(input)
    if (Array.isArray(input)) {
        let output = [];
        for (const index of input)
            output.push(clone(input[index]));
        return output;
    }
    else if (isPlainObject(input)) {
        let output = {};
        for (const index in input)
            output[index] = clone(input[index]);
        return output;
    }
    else {
        return input;
    }
}


function _cmpObj(ref,comp){
	let delta = {};
	//look at remove element in the ref
	for (const key in ref) {
		//console.log(key)
			if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
			if (!comp[key]) delta[key] = null  
        }
	
	
	 for (const key in comp) {
		// console.log(key)
            if (key === '__proto__' || key === 'constructor' || key === 'prototype')
                continue;
            const cValue = comp[key];
			if (!ref[key]) {delta[key]=clone(cValue);continue}
			const rValue = ref[key];
			//compare the rValue and cValue; 
			if (!isPlainObject(cValue))
			{
				if(Array.isArray(cValue)){
					//if cValue is an array, then check the rValue using string representation, if not matching then delta will be the clone of Comp
					if ((JSON.stringify(cValue) !== JSON.stringify(rValue))){
						delta[key]=clone(cValue);
						continue;
					}
					
				}
				if(!isPlainObject(rValue)){
					if(Array.isArray(rValue)){
						//look like cValue is not an Array and rValue is; clone cValue
						delta[key]=clone(cValue);
						continue;
					}
					//both element are not object or Array, then simple compare
					if ((cValue !== rValue)) delta[key]=clone(cValue)
				}
				else
				{
					//rValue is an Object but cValue is not, then delta will copy cValue
					delta[key]=clone(cValue);
				}
				
			}
			else{
				//as this is recursive, then need to make recursive 
				const retVal = _cmpObj(ref[key],comp[key]);
				if (Object.keys(retVal).length>0)delta[key]=retVal;
				
			}
			
         
        }
		return delta
}
function delta(ref,comp) {
	return _cmpObj(ref,comp)
}
exports.delta = delta;
