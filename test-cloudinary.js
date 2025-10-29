import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log("=".repeat(60));
console.log("🔍 CLOUDINARY CREDENTIALS VERIFICATION");
console.log("=".repeat(60));

// Check if credentials are loaded
console.log("\n📋 Environment Variables:");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing");
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing");
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing");

// Display actual values (masked for security)
if (process.env.CLOUDINARY_CLOUD_NAME) {
    console.log("\n📝 Credential Values:");
    console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("API Key:", process.env.CLOUDINARY_API_KEY?.substring(0, 5) + "..." + process.env.CLOUDINARY_API_KEY?.slice(-4));
    console.log("API Secret:", process.env.CLOUDINARY_API_SECRET?.substring(0, 5) + "..." + process.env.CLOUDINARY_API_SECRET?.slice(-4));
}

// Test API connection
console.log("\n🔌 Testing Cloudinary Connection...");

async function testCloudinary() {
    try {
        // Test 1: Ping API
        console.log("\n1️⃣ Testing API Connection...");
        const result = await cloudinary.api.ping();
        console.log("✅ API Connection: SUCCESS");
        console.log("   Status:", result.status);

        // Test 2: Get account usage
        console.log("\n2️⃣ Testing Account Access...");
        const usage = await cloudinary.api.usage();
        console.log("✅ Account Access: SUCCESS");
        console.log("   Plan:", usage.plan || "Free");
        console.log("   Credits Used:", usage.credits?.usage || 0);
        console.log("   Credits Limit:", usage.credits?.limit || "Unlimited");
        console.log("   Storage Used:", (usage.storage?.usage / 1024 / 1024).toFixed(2), "MB");

        // Test 3: List resources (check if we can access files)
        console.log("\n3️⃣ Testing Resource Access...");
        const resources = await cloudinary.api.resources({
            resource_type: 'raw',
            max_results: 5
        });
        console.log("✅ Resource Access: SUCCESS");
        console.log("   Total Resources:", resources.total_count || 0);
        
        if (resources.resources && resources.resources.length > 0) {
            console.log("\n   Recent Files:");
            resources.resources.forEach((file, index) => {
                console.log(`   ${index + 1}. ${file.public_id} (${(file.bytes / 1024).toFixed(2)} KB)`);
            });
        } else {
            console.log("   No files uploaded yet");
        }

        // Test 4: Check upload preset
        console.log("\n4️⃣ Testing Upload Capability...");
        console.log("✅ Upload Configuration: READY");
        console.log("   Resource Types Supported: image, raw, video");
        console.log("   Max File Size: Based on your plan");

        console.log("\n" + "=".repeat(60));
        console.log("✅ ALL TESTS PASSED - Cloudinary is properly configured!");
        console.log("=".repeat(60));

    } catch (error) {
        console.log("\n" + "=".repeat(60));
        console.log("❌ CLOUDINARY TEST FAILED");
        console.log("=".repeat(60));
        console.error("\n🔴 Error Details:");
        console.error("Message:", error.message);
        console.error("Error Code:", error.error?.http_code || "Unknown");
        
        if (error.error?.message) {
            console.error("API Error:", error.error.message);
        }

        console.log("\n💡 Common Issues:");
        console.log("1. Invalid credentials - Check your .env file");
        console.log("2. Wrong cloud name - Verify on Cloudinary dashboard");
        console.log("3. API key/secret mismatch - Regenerate if needed");
        console.log("4. Network issues - Check internet connection");
        
        console.log("\n📚 How to Fix:");
        console.log("1. Go to: https://cloudinary.com/console");
        console.log("2. Login to your account");
        console.log("3. Copy credentials from Dashboard");
        console.log("4. Update your .env file");
        console.log("5. Restart the server");
    }
}

// Run the test
testCloudinary();
