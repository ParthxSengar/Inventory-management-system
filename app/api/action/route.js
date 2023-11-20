import { NextResponse } from "next/server";

const { MongoClient } = require("mongodb");

export async function POST(request) {

    let {action, slug, initialQuantity} = await request.json();
    const uri = "mongodb+srv://parthsengr18:AmLEqHX6m838IJsn@cluster0.zmv6eby.mongodb.net/";
    
    const client = new MongoClient(uri);
    
        try {
            const database = client.db('stock');
            const inventory = database.collection('inventory');
            
            const filter = {slug: slug};

            let newQuantity = action == "plus" ? (parseInt(initialQuantity) + 1) : (parseInt(initialQuantity) - 1);
            const updateDoc = {
                $set: {
                    quantity: newQuantity
                }
            }
            const result = await inventory.updateOne(filter, updateDoc, {});
            
            return NextResponse.json({success: true, message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`})
        } finally {
            await client.close();
        }
}