"use client"

import { useState, useEffect } from "react";

import recipe from "@/static/recipes.json";
import decomposeInChemMaster from "@/helpers/decomposeInChemMaster";

import "./page.scss";

import { TReagent, TRecipe } from "@/types/chemist";
import Input from "@/UI/Input/Input";


export default function Home() {
    const [values, setValues] = useState({
        reagent: "",
        ounces: 90
    })
    const [TRecipe, setRecipe] = useState<TRecipe>({})

    const changeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => setValues(prev => ({...prev, [ev.target.name]: ev.target.value}))

    const submitHandler = (ev: React.FormEvent) => {
        ev.preventDefault()

        if (!(values.reagent in recipe)) return 

        setRecipe(decomposeInChemMaster(values.reagent as TReagent, values.ounces))
    }

    const clickHandler = (reagent: TReagent) => {
        setRecipe(decomposeInChemMaster(reagent, values.ounces))
        setValues(prev => ({...prev, reagent}))
    }

    useEffect(() => {
        if (!(values.reagent in recipe)) return 
    
        setRecipe(decomposeInChemMaster(values.reagent as TReagent, values.ounces))
    }, [values.ounces])
    console.log(TRecipe)
    return (
        <div className="home">
            <div className="container">
                <div className="input-section">
                    <form className="reagent-input" onSubmit={submitHandler}>
                        <Input 
                            value={values.reagent} 
                            name="reagent" 
                            onChange={changeHandler}
                        />
                        <div className="list-helper">
                            {Object.keys(recipe).map(reactant => (
                                <div className="list-reactant" key={reactant} onClick={clickHandler.bind(null, reactant as TReagent)}>
                                    {reactant}
                                </div>
                            ))}
                        </div>
                    </form>
                    <div className="ounces-input">
                        <Input 
                            value={values.ounces} 
                            name="ounces" 
                            onChange={changeHandler}
                            type="number"
                        />
                    </div>                    
                </div>

                <div className="recipe-section">
                    {Object.keys(TRecipe).map(reactant => (
                        <div className="reactant" key={reactant}>
                            <p>
                                {reactant}: {TRecipe[reactant]}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

