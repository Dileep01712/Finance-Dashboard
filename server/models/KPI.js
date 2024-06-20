import mongoose from "mongoose";
import { loadType } from "mongoose-currency";
import Currency from 'currency-converter-lt';

const Schema = mongoose.Schema;
loadType(mongoose);


const daySchema = new Schema({
    date: String,
    revenue: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (value) => value / 100
    },
    expenses: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (value) => value / 100
    },
}, {
    toJSON: { getters: true }
});


const monthSchema = new Schema({
    month: String,
    revenue: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (value) => value / 100
    },
    expenses: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (value) => value / 100
    },
    operationalExpenses: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (value) => value / 100
    },
    nonOperationalExpenses: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (value) => value / 100
    },
}, {
    toJSON: { getters: true }
});


const KPISchema = new Schema({
    totalProfit: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (value) => value / 100
    },
    totalRevenue: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (value) => value / 100
    },
    totalExpenses: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (value) => value / 100
    },
    expensesByCategory: {
        type: Map,
        of: {
            type: mongoose.Types.Currency,
            currency: "USD",
            get: (value) => value / 100
        }
    },
    monthlyData: [monthSchema],
    dailyData: [daySchema],
}, {
    timestamps: true,
    toJSON: { getters: true }
});


// Add a method to convert values to INR
KPISchema.methods.convertToINR = async function () {
    const currencyConverter = new Currency({ from: "USD", to: "INR", amount: 1 });
    const conversionRate = await currencyConverter.convert();

    const convertValue = (value) => {
        return (value / 100) * conversionRate;
    };

    return {
        totalProfitINR: convertValue(this.totalProfit),
        totalRevenueINR: convertValue(this.totalRevenue),
        totalExpensesINR: convertValue(this.totalExpenses),
        expensesByCategoryINR: Object.fromEntries(
            Array.from(this.expensesByCategory.entries()).map(([key, value]) => [key, convertValue(value)])
        ),
        monthlyDataINR: this.monthlyData.map(month => ({
            month: month.month,
            revenue: convertValue(month.revenue),
            expenses: convertValue(month.expenses),
            operationalExpenses: convertValue(month.operationalExpenses),
            nonOperationalExpenses: convertValue(month.nonOperationalExpenses),
        })),
        dailyDataINR: this.dailyData.map(day => ({
            date: day.date,
            revenue: convertValue(day.revenue),
            expenses: convertValue(day.expenses),
        }))
    };
};

const KPI = mongoose.model("KPI", KPISchema);

export default KPI;