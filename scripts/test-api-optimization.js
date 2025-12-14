/**
 * Test script to verify API optimization with pagination
 * Tests: pagination, filtering, caching headers, response sizes
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testAPI(endpoint, description) {
  console.log(`\n🧪 Testing: ${description}`);
  console.log(`   URL: ${endpoint}`);
  
  try {
    const startTime = Date.now();
    const response = await fetch(endpoint);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const data = await response.json();
    const responseSize = JSON.stringify(data).length;
    
    console.log(`   ✅ Status: ${response.status}`);
    console.log(`   ⏱️  Response Time: ${responseTime}ms`);
    console.log(`   📦 Response Size: ${(responseSize / 1024).toFixed(2)} KB`);
    console.log(`   📊 Recruiters Returned: ${data.recruiters?.length || 0}`);
    console.log(`   📄 Total Count: ${data.total || 0}`);
    console.log(`   📑 Page: ${data.page || 'N/A'}`);
    console.log(`   📚 Total Pages: ${data.totalPages || 'N/A'}`);
    
    // Check cache headers
    const cacheControl = response.headers.get('cache-control');
    if (cacheControl) {
      console.log(`   💾 Cache: ${cacheControl}`);
    }
    
    return {
      success: true,
      responseTime,
      responseSize,
      recruiterCount: data.recruiters?.length || 0,
      total: data.total || 0,
    };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting API Optimization Tests\n');
  console.log('='.repeat(60));
  
  const results = [];
  
  // Test 1: First page (no filters) - should be cached
  results.push(await testAPI(
    `${BASE_URL}/api/recruiters?country=in&page=1&limit=12`,
    'First page (no filters) - Should have long cache'
  ));
  
  // Test 2: Second page
  results.push(await testAPI(
    `${BASE_URL}/api/recruiters?country=in&page=2&limit=12`,
    'Second page - Should have short cache'
  ));
  
  // Test 3: With search query
  results.push(await testAPI(
    `${BASE_URL}/api/recruiters?country=in&page=1&limit=12&q=sharma`,
    'With search filter - Should have short cache'
  ));
  
  // Test 4: With specialization filter
  results.push(await testAPI(
    `${BASE_URL}/api/recruiters?country=in&page=1&limit=12&specialization=Talent Acquisition`,
    'With specialization filter - Should have short cache'
  ));
  
  // Test 5: Large page size (should still be limited)
  results.push(await testAPI(
    `${BASE_URL}/api/recruiters?country=in&page=1&limit=24`,
    'Larger page size (24 items)'
  ));
  
  // Test 6: Last page
  results.push(await testAPI(
    `${BASE_URL}/api/recruiters?country=in&page=1&limit=12&sortBy=name-desc`,
    'With sorting - name descending'
  ));
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  if (successful.length > 0) {
    const avgResponseTime = successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length;
    const avgResponseSize = successful.reduce((sum, r) => sum + r.responseSize, 0) / successful.length;
    const avgRecruiters = successful.reduce((sum, r) => sum + r.recruiterCount, 0) / successful.length;
    
    console.log(`\n📈 Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`📦 Average Response Size: ${(avgResponseSize / 1024).toFixed(2)} KB`);
    console.log(`👥 Average Recruiters per Response: ${avgRecruiters.toFixed(1)}`);
    
    // Compare to expected (all 885 recruiters would be ~500KB+)
    const expectedSizeIfAll = 500 * 1024; // ~500KB
    const savings = ((expectedSizeIfAll - avgResponseSize) / expectedSizeIfAll * 100).toFixed(1);
    console.log(`\n💰 Estimated Payload Reduction: ~${savings}%`);
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    failed.forEach((f, i) => {
      console.log(`   ${i + 1}. ${f.error}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
}

// Check if running in Node.js environment
if (typeof fetch === 'undefined') {
  console.log('⚠️  This script requires Node.js 18+ with native fetch support');
  console.log('   Or install node-fetch: npm install node-fetch');
  process.exit(1);
}

// Run tests
runTests().catch(console.error);

