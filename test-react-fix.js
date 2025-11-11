const { chromium } = require('playwright');

async function testReactFix() {
  console.log('🚀 Starting React useLayoutEffect fix verification...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow down for better observation
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Capture console messages
  const consoleMessages = [];
  const errors = [];
  
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
    console.log(`📝 Console [${msg.type()}]: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  try {
    console.log('🌐 Navigating to http://localhost:3003...');
    
    // Navigate to the site
    await page.goto('http://localhost:3003', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('✅ Page loaded successfully');
    
    // Wait for React to mount
    await page.waitForTimeout(2000);
    
    // Take screenshot of initial load
    await page.screenshot({ 
      path: 'C:\\Users\\luiss\\techflow-solutions\\screenshots\\initial-load.png',
      fullPage: true 
    });
    console.log('📸 Initial screenshot saved');
    
    // Check if the main content is visible (not white screen)
    const heroSection = await page.locator('header, .hero, h1, main').first();
    const isVisible = await heroSection.isVisible({ timeout: 5000 });
    
    if (isVisible) {
      console.log('✅ Main content is visible - no white screen');
    } else {
      console.log('❌ Main content not visible - potential white screen issue');
    }
    
    // Test navigation between pages
    console.log('\n🔗 Testing navigation...');
    
    // Try to find and click navigation links
    const navLinks = await page.locator('nav a, .nav a, header a').all();
    console.log(`Found ${navLinks.length} navigation links`);
    
    // Test a few navigation links
    if (navLinks.length > 0) {
      for (let i = 0; i < Math.min(3, navLinks.length); i++) {
        try {
          const linkText = await navLinks[i].textContent();
          console.log(`🔗 Clicking: ${linkText}`);
          
          await navLinks[i].click();
          await page.waitForTimeout(1000);
          
          // Check if page changed without errors
          const currentUrl = page.url();
          console.log(`📍 Current URL: ${currentUrl}`);
          
        } catch (navError) {
          console.log(`⚠️ Navigation error: ${navError.message}`);
        }
      }
    }
    
    // Check for specific React errors
    console.log('\n🔍 Checking for React-specific errors...');
    
    const reactErrors = consoleMessages.filter(msg => 
      msg.text.includes('useLayoutEffect') ||
      msg.text.includes('createContext') ||
      msg.text.includes('React') ||
      msg.text.includes('hydration') ||
      msg.text.includes('Warning:')
    );
    
    if (reactErrors.length === 0) {
      console.log('✅ No React-specific errors found');
    } else {
      console.log('❌ React errors detected:');
      reactErrors.forEach(error => {
        console.log(`   - [${error.type}] ${error.text}`);
      });
    }
    
    // Check network requests for JavaScript files
    console.log('\n📦 Checking JavaScript chunk loading...');
    
    const response = await page.goto('http://localhost:3003', { 
      waitUntil: 'networkidle' 
    });
    
    // Monitor network requests
    const requests = [];
    page.on('request', request => {
      if (request.url().includes('.js')) {
        requests.push(request.url());
      }
    });
    
    await page.reload({ waitUntil: 'networkidle' });
    
    console.log('📦 JavaScript files loaded:');
    requests.forEach(url => {
      if (url.includes('react-libs')) {
        console.log(`   ✅ React libs chunk: ${url.split('/').pop()}`);
      } else if (url.includes('index-')) {
        console.log(`   ✅ Main index: ${url.split('/').pop()}`);
      } else if (url.includes('vendor-')) {
        console.log(`   ✅ Vendor chunk: ${url.split('/').pop()}`);
      } else {
        console.log(`   📄 Other JS: ${url.split('/').pop()}`);
      }
    });
    
    // Final screenshot
    await page.screenshot({ 
      path: 'C:\\Users\\luiss\\techflow-solutions\\screenshots\\final-state.png',
      fullPage: true 
    });
    console.log('📸 Final screenshot saved');
    
    // Summary
    console.log('\n📊 VERIFICATION SUMMARY');
    console.log('========================');
    console.log(`✅ Page loads: ${response?.ok() ? 'SUCCESS' : 'FAILED'}`);
    console.log(`✅ Content visible: ${isVisible ? 'YES' : 'NO'}`);
    console.log(`✅ Console errors: ${errors.length === 0 ? 'NONE' : errors.length + ' found'}`);
    console.log(`✅ React errors: ${reactErrors.length === 0 ? 'NONE' : reactErrors.length + ' found'}`);
    console.log(`✅ JavaScript chunks: ${requests.filter(r => r.includes('.js')).length} loaded`);
    
    if (errors.length === 0 && reactErrors.length === 0 && isVisible) {
      console.log('\n🎉 SUCCESS: React useLayoutEffect fix appears to be working!');
    } else {
      console.log('\n❌ ISSUES DETECTED: Further investigation needed');
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

testReactFix().catch(console.error);