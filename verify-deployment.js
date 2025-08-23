#!/usr/bin/env node

// Vercel deployment validation script
const fs = require('fs');
const path = require('path');

console.log('🚀 Validating Vercel deployment configuration...\n');

// Check vercel.json
const vercelConfigPath = path.join(__dirname, 'vercel.json');
if (!fs.existsSync(vercelConfigPath)) {
    console.error('❌ vercel.json not found!');
    process.exit(1);
}

try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    
    // Check for deprecated routes property
    if (vercelConfig.routes) {
        console.error('❌ Deprecated "routes" property found in vercel.json');
        console.error('   This will cause "Mixed routing properties" error');
        console.error('   Use "rewrites" instead');
        process.exit(1);
    }
    
    // Check for required properties
    const requiredProps = ['version', 'builds'];
    for (const prop of requiredProps) {
        if (!vercelConfig[prop]) {
            console.error(`❌ Missing required property "${prop}" in vercel.json`);
            process.exit(1);
        }
    }
    
    console.log('✅ vercel.json configuration looks good');
    
    // Check for builds
    if (vercelConfig.builds && vercelConfig.builds.length > 0) {
        console.log(`✅ Found ${vercelConfig.builds.length} build configurations`);
    }
    
    // Check for rewrites
    if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
        console.log(`✅ Found ${vercelConfig.rewrites.length} rewrite rules`);
    }
    
    // Check for headers
    if (vercelConfig.headers && vercelConfig.headers.length > 0) {
        console.log(`✅ Found ${vercelConfig.headers.length} header configurations`);
    }
    
} catch (error) {
    console.error('❌ Error parsing vercel.json:', error.message);
    process.exit(1);
}

// Check for required files
const requiredFiles = [
    'backend/server.js',
    'home.html',
    'package.json',
    'backend/package.json'
];

for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(__dirname, file))) {
        console.error(`❌ Required file missing: ${file}`);
        process.exit(1);
    }
}

console.log('✅ All required files present');

// Check package.json
try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'backend/package.json'), 'utf8'));
    if (!packageJson.dependencies) {
        console.error('❌ No dependencies found in backend/package.json');
        process.exit(1);
    }
    console.log('✅ Backend dependencies look good');
} catch (error) {
    console.error('❌ Error reading backend/package.json:', error.message);
    process.exit(1);
}

console.log('\n🎉 Deployment configuration validation passed!');
console.log('📤 Ready to deploy to Vercel');

// Display next steps
console.log('\n📋 Next steps:');
console.log('1. Set environment variables in Vercel dashboard:');
console.log('   - MONGODB_URI');
console.log('   - JWT_SECRET');
console.log('   - EMAIL_USER');
console.log('   - EMAIL_PASS');
console.log('   - NODE_ENV=production');
console.log('2. Deploy: vercel --prod');
