#!/usr/bin/env node

/**
 * ProductiveFire Database Cleanup Utility
 * 
 * This script helps maintain database hygiene and removes sensitive data
 * Use with caution - this will permanently delete data
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/productivefire';
const LOG_FILE = path.join(__dirname, '..', 'app.log');

// ANSI colors for better console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

function log(message, color = 'white') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
    console.error(`${colors.red}❌ ${message}${colors.reset}`);
}

function logSuccess(message) {
    console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logWarning(message) {
    console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function logInfo(message) {
    console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

async function connectToDatabase() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        logSuccess('Connected to MongoDB successfully');
        return client;
    } catch (error) {
        logError(`Failed to connect to MongoDB: ${error.message}`);
        throw error;
    }
}

async function cleanupDatabase(client) {
    try {
        const db = client.db('productivefire');
        
        log('\n🔍 Database Collections:', 'cyan');
        const collections = await db.listCollections().toArray();
        
        if (collections.length === 0) {
            logWarning('No collections found in database');
            return;
        }
        
        collections.forEach(collection => {
            log(`  - ${collection.name}`, 'white');
        });
        
        // Get statistics
        log('\n📊 Collection Statistics:', 'cyan');
        for (const collection of collections) {
            const collectionObj = db.collection(collection.name);
            const count = await collectionObj.countDocuments();
            log(`  - ${collection.name}: ${count} documents`, 'white');
            
            // Show sample document structure (without sensitive data)
            if (count > 0) {
                const sample = await collectionObj.findOne({}, { 
                    projection: { 
                        password: 0, 
                        email: 0, 
                        resetToken: 0, 
                        verificationToken: 0 
                    } 
                });
                if (sample) {
                    log(`    Sample structure: ${Object.keys(sample).join(', ')}`, 'magenta');
                }
            }
        }
        
        logSuccess('Database inspection completed');
        
    } catch (error) {
        logError(`Database cleanup failed: ${error.message}`);
        throw error;
    }
}

async function cleanupLogs() {
    try {
        log('\n🧹 Cleaning up log files...', 'cyan');
        
        if (fs.existsSync(LOG_FILE)) {
            const stats = fs.statSync(LOG_FILE);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            
            logInfo(`Found log file: ${LOG_FILE} (${fileSizeMB} MB)`);
            
            // Read log file to check for sensitive data
            const logContent = fs.readFileSync(LOG_FILE, 'utf8');
            const lines = logContent.split('\n');
            
            // Check for potential sensitive data patterns
            const sensitivePatterns = [
                /password/i,
                /secret/i,
                /token.*[a-zA-Z0-9]{20,}/i,
                /mongodb\+srv:\/\/.*:.*@/i,
                /email.*@.*\./i
            ];
            
            let foundSensitiveData = false;
            let sensitiveLines = [];
            
            lines.forEach((line, index) => {
                sensitivePatterns.forEach(pattern => {
                    if (pattern.test(line)) {
                        foundSensitiveData = true;
                        sensitiveLines.push({
                            line: index + 1,
                            content: line.substring(0, 100) + '...'
                        });
                    }
                });
            });
            
            if (foundSensitiveData) {
                logWarning('Found potentially sensitive data in logs:');
                sensitiveLines.slice(0, 5).forEach(item => {
                    log(`    Line ${item.line}: ${item.content}`, 'yellow');
                });
                if (sensitiveLines.length > 5) {
                    log(`    ... and ${sensitiveLines.length - 5} more lines`, 'yellow');
                }
            }
            
            // Clear the log file
            fs.writeFileSync(LOG_FILE, '');
            logSuccess('Log file cleared');
        } else {
            logInfo('No log file found to clean');
        }
        
    } catch (error) {
        logError(`Log cleanup failed: ${error.message}`);
    }
}

async function validateEnvironment() {
    log('\n🔐 Environment Security Check:', 'cyan');
    
    const requiredVars = ['JWT_SECRET', 'MONGODB_URI'];
    const sensitiveVars = ['EMAIL_PASS', 'EMAIL_USER'];
    
    requiredVars.forEach(varName => {
        if (process.env[varName]) {
            if (varName === 'JWT_SECRET') {
                const secretLength = process.env[varName].length;
                if (secretLength < 32) {
                    logWarning(`${varName} is too short (${secretLength} chars). Recommended: 64+ chars`);
                } else {
                    logSuccess(`${varName} is properly configured (${secretLength} chars)`);
                }
            } else {
                logSuccess(`${varName} is configured`);
            }
        } else {
            logError(`Missing required environment variable: ${varName}`);
        }
    });
    
    sensitiveVars.forEach(varName => {
        if (process.env[varName]) {
            if (process.env[varName].includes('your-') || process.env[varName].includes('example')) {
                logWarning(`${varName} appears to contain placeholder text`);
            } else {
                logSuccess(`${varName} is configured`);
            }
        } else {
            logInfo(`Optional variable ${varName} is not set`);
        }
    });
    
    // Check for development vs production settings
    const nodeEnv = process.env.NODE_ENV || 'development';
    log(`\n🌍 Environment: ${nodeEnv}`, 'cyan');
    
    if (nodeEnv === 'production') {
        logInfo('Production environment detected');
        // Additional production checks
        if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 64) {
            logWarning('JWT_SECRET should be longer in production (64+ characters)');
        }
    } else {
        logInfo('Development environment detected');
    }
}

async function interactiveCleanup() {
    log('\n🛠️  Interactive Cleanup Options:', 'cyan');
    log('1. View database statistics only', 'white');
    log('2. Clear log files', 'white');
    log('3. Validate environment configuration', 'white');
    log('4. Full cleanup (logs + validation)', 'white');
    log('5. Exit', 'white');
    
    // For now, just run full inspection
    logInfo('Running full inspection and cleanup...\n');
    
    let client;
    try {
        // Validate environment
        await validateEnvironment();
        
        // Connect to database and inspect
        client = await connectToDatabase();
        await cleanupDatabase(client);
        
        // Clean up logs
        await cleanupLogs();
        
        log('\n🎉 Cleanup completed successfully!', 'green');
        
    } catch (error) {
        logError(`Cleanup failed: ${error.message}`);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            logInfo('Database connection closed');
        }
    }
}

// Main execution
if (require.main === module) {
    log('🔥 ProductiveFire Database Cleanup Utility', 'cyan');
    log('==========================================\n', 'cyan');
    
    interactiveCleanup().catch(error => {
        logError(`Fatal error: ${error.message}`);
        process.exit(1);
    });
}

module.exports = {
    connectToDatabase,
    cleanupDatabase,
    cleanupLogs,
    validateEnvironment
};
