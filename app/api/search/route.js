import { NextResponse } from "next/server";

const { MongoClient } = require("mongodb");

export async function GET(request) {
    const query = request.nextUrl.searchParams.get("query");
    const uri = "mongodb+srv://parthsengr18:AmLEqHX6m838IJsn@cluster0.zmv6eby.mongodb.net/";
    
    const client = new MongoClient(uri);
    
        try {
            const database = client.db('stock');
            const inventory = database.collection('inventory');
            
            const products = await inventory.aggregate([{
                $match: {
                    $or: [
                        {slug: {$regex: query, $options: "i"}},
                    ]
                }
            }]).toArray();
            
            return NextResponse.json({success: true ,products})
        } finally {
            await client.close();
        }
}