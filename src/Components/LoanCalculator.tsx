import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import cx from "classnames";
import style from "./LoanCalculator.module.scss";
import { UserSchema, UserSchemaType } from "../schemas";

export const LoanCalculator = () => {
    const [calculatedLoanAmount, setCalculatedLoanAmount] = useState<number>(0)
    const formMethods = useForm<UserSchemaType>({
        mode: "onTouched",
        resolver: zodResolver(UserSchema),
    });
    const { register, handleSubmit, formState: { errors } } = formMethods;

    const onCheckLoanAmount: SubmitHandler<UserSchemaType> = async (user) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/loan/loan-calculator`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user),
                }
            )
            const { calculateLoanAmount } = await response.json()
            setCalculatedLoanAmount(calculateLoanAmount)
        } catch (err) {
            console.error('Request failed', err)
            setCalculatedLoanAmount(0)
        }
    }

    return (
        <form onSubmit={handleSubmit(onCheckLoanAmount, (e) => console.log(e))}>

            <div className={style.container}>
                <div>
                    <div className={cx({ [style.error]: errors.id })}>
                        User ID
                    </div>
                    <div>
                        <input autoComplete="off" {...register("id", { valueAsNumber: true })} />
                        {errors.id && <div className={style.error}>{errors.id.message}</div>}
                    </div>
                </div>
                <div>
                    <div className={cx({ [style.error]: errors.amount })}>
                        Loan Amount
                    </div>
                    <div>
                        <input autoComplete="off" {...register("amount", { valueAsNumber: true })} />
                        {errors.amount && <div className={style.error}>{errors.amount.message}</div>}
                    </div>
                </div>
                <div>
                    <div className={cx({ [style.error]: errors.periodInMonths })}>
                        Loan Period
                    </div>
                    <div>
                        <input autoComplete="off" {...register("periodInMonths", { valueAsNumber: true })} />
                        {errors.periodInMonths && <div className={style.error}>{errors.periodInMonths.message}</div>}
                    </div>
                </div>
                <div>
                    <div>
                        <span>Calculated Amount:</span>
                        {calculatedLoanAmount > 0 && <b>{calculatedLoanAmount}</b>}
                    </div>
                </div>
                <div>
                    <input type="submit" value='calculate' />
                </div>
            </div>
        </form>
    );
}