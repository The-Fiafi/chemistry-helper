import recipes from "@/static/recipes.json";

import { IChemist, TReagent, TRecipe } from "@/types/chemist";

let allowedReactions = new Set<TReagent>()
    
export default function decomposeInChemMaster(reagent: TReagent, ounces: number, globalOutput: TRecipe = {}) {
    let output: TRecipe = {}
    
    const currentReagent: IChemist = recipes[reagent]
    const childrenReagent =  Object.keys(currentReagent.reactants)

    const reactionRatio = ounces / currentReagent.products[reagent]

    allowedReactions.add(reagent)

    for (let child of childrenReagent) {
        const childrenOunces = currentReagent.reactants[child].amount * reactionRatio
        
        if (child in recipes) {
            const childrenRecipe = decomposeInChemMaster(
                child as TReagent, 
                childrenOunces, 
                updateGlobalOutput(globalOutput, output)
            )
            
            Object.keys(childrenRecipe).forEach(el => {
                if (output[el]) return output[el] += childrenRecipe[el]

                output[el] = childrenRecipe[el]
            }) 

            allowedReactions.add(child as TReagent)
            
            continue
        }
        
        if (!checkAlternateReactions(globalOutput, child)) return {[reagent]: ounces}

        output[child] = childrenOunces
    }
  
    if (!Object.keys(globalOutput).length) allowedReactions = new Set<TReagent>()

    return output
}

function sortReagent(a: string, b: string) {
    const aReactant: IChemist = recipes[a as TReagent]
    const bReactant: IChemist = recipes[b as TReagent]

    if (aReactant && bReactant) return aReactant.products[a] - bReactant.products[b]
    if (aReactant && !bReactant) return -1

    return 1
} 

function updateGlobalOutput(globalOutput: TRecipe, localOutput: TRecipe) {
    const output: TRecipe = {...localOutput}

    Object.keys(globalOutput).forEach(reactant => {
        if (output[reactant]) return output[reactant] += globalOutput[reactant]

        output[reactant] = globalOutput[reactant]
    })

    return output
}

function checkAlternateReactions(reactionComponents: TRecipe, reactant: string) {
    let output = true
   
    let chemistList = new Set([...Object.keys(reactionComponents), reactant])
    const prevLength = chemistList.size

    for (let recipe of Object.values(recipes)) {
        if (recipe.id in allowedReactions) return
         
        Object.keys(recipe.reactants).forEach(reactant => chemistList.add(reactant))

        if (chemistList.size === prevLength) {
            console.log(chemistList)
            output = false
    
        }

        chemistList = new Set([...Object.keys(reactionComponents), reactant])
    }

    return output
}

