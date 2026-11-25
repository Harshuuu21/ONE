import assert from 'node:assert/strict';
import { ConfidenceScoringService, DEFAULT_SCORING_WEIGHTS } from '../services/confidence-scoring.service.js';
import { TransactionClassificationService } from '../services/transaction-classification.service.js';
import { MerchantNormalizationService } from '../services/merchant-normalization.service.js';
import { MerchantRepository } from '../repositories/merchant.repository.js';
import { CategorizationService } from '../services/categorization.service.js';

console.log('=== STARTING SMART SPENDING INTELLIGENCE ENGINE TESTS ===\n');

// ---------------------------------------------------------------------------
// TEST 1: Pure Mathematical Confidence-Scoring Formula
// ---------------------------------------------------------------------------
console.log('1. Testing Mathematical Confidence-Scoring Formula & Normalization...');
{
  // Full availability: I=0.40, M=0.30, N=0.20, H=0.10. Denom = 1.00
  const fullScore = ConfidenceScoringService.calculateConfidenceScore(
    { verifiedIdentifierStrength: 1.0, mccStrength: 1.0, nameMatchStrength: 1.0, historyStrength: 1.0 },
    { hasVerifiedIdentifier: true, hasMcc: true, hasNameMatch: true, hasHistory: true }
  );
  assert.equal(fullScore.score, 100);
  assert.equal(fullScore.availableWeightsSum, 1.0);

  // Missing MCC & History: available = I(0.40) + N(0.20) = 0.60
  // C = 100 * (0.40*1.0 + 0.20*1.0) / 0.60 = 100 * 0.60 / 0.60 = 100
  const partialAvail = ConfidenceScoringService.calculateConfidenceScore(
    { verifiedIdentifierStrength: 1.0, mccStrength: 0, nameMatchStrength: 1.0, historyStrength: 0 },
    { hasVerifiedIdentifier: true, hasMcc: false, hasNameMatch: true, hasHistory: false }
  );
  assert.equal(partialAvail.score, 100);
  assert.equal(partialAvail.availableWeightsSum, 0.60);

  // Partial signal strengths: I=1.0, M=0.5 (broad), N=0.0
  // available = 0.40 + 0.30 + 0.20 = 0.90
  // num = 0.40*1.0 + 0.30*0.5 + 0.20*0.0 = 0.40 + 0.15 = 0.55
  // score = (0.55 / 0.90) * 100 = 61.11%
  const partialStrength = ConfidenceScoringService.calculateConfidenceScore(
    { verifiedIdentifierStrength: 1.0, mccStrength: 0.5, nameMatchStrength: 0.0, historyStrength: 0.0 },
    { hasVerifiedIdentifier: true, hasMcc: true, hasNameMatch: true, hasHistory: false }
  );
  assert.equal(partialStrength.score, 61.11);
  assert.equal(partialStrength.availableWeightsSum, 0.90);

  // Zero available signals -> score 0
  const zeroAvail = ConfidenceScoringService.calculateConfidenceScore(
    { verifiedIdentifierStrength: 0, mccStrength: 0, nameMatchStrength: 0, historyStrength: 0 },
    { hasVerifiedIdentifier: false, hasMcc: false, hasNameMatch: false, hasHistory: false }
  );
  assert.equal(zeroAvail.score, 0);
  assert.equal(zeroAvail.availableWeightsSum, 0);
  console.log('  ✓ Confidence mathematical formula & weight denominator exclusion verified.');
}

// ---------------------------------------------------------------------------
// TEST 2: Exact Verified Merchant Identifier Matching
// ---------------------------------------------------------------------------
console.log('2. Testing Exact Verified Merchant Matching...');
{
  const tx = {
    amount: 450,
    upiId: 'apollo@upi',
    merchantName: 'Apollo Pharmacy',
    isConfirmedPayment: true,
  };
  const res = TransactionClassificationService.classify(tx);
  assert.equal(res.finalCategory, 'MEDICINE');
  assert.equal(res.identifiedMerchantId, 'MERCH_APOLLO_PHARMACY');
  assert.ok(res.confidenceScore >= 90);
  assert.equal(res.confidenceTier, 'HIGH');
  console.log(`  ✓ Apollo Pharmacy (apollo@upi) classified as ${res.finalCategory} (${res.confidenceScore}%).`);
}

// ---------------------------------------------------------------------------
// TEST 3: Authoritative MCC Matching
// ---------------------------------------------------------------------------
console.log('3. Testing MCC Matching...');
{
  // Fast Food MCC 5814
  const txFood = {
    amount: 320,
    mcc: '5814',
    merchantName: 'Corner Burger Joint',
    isConfirmedPayment: true,
  };
  const resFood = TransactionClassificationService.classify(txFood);
  assert.equal(resFood.finalCategory, 'FOOD');
  assert.ok(resFood.confidenceScore >= 70);

  // Supermarket MCC 5411
  const txGrocery = {
    amount: 1450,
    mcc: 5411,
    isConfirmedPayment: true,
  };
  const resGrocery = TransactionClassificationService.classify(txGrocery);
  assert.equal(resGrocery.finalCategory, 'GROCERIES');
  assert.ok(resGrocery.confidenceScore >= 90);
  console.log(`  ✓ MCC 5814 classified as ${resFood.finalCategory}, MCC 5411 as ${resGrocery.finalCategory}.`);
}

// ---------------------------------------------------------------------------
// TEST 4: Strong Merchant Name & Alias Matching
// ---------------------------------------------------------------------------
console.log('4. Testing Strong Merchant Name & Alias Matching...');
{
  // Domino's alias
  const txDominos = {
    amount: 699,
    merchantName: "Domino's Pizza",
    isConfirmedPayment: true,
  };
  const resDominos = TransactionClassificationService.classify(txDominos);
  assert.equal(resDominos.finalCategory, 'FOOD');
  assert.equal(resDominos.identifiedMerchantId, 'MERCH_DOMINOS');

  // Netflix streaming
  const txNetflix = {
    amount: 649,
    merchantName: 'Netflix India',
    isConfirmedPayment: true,
  };
  const resNetflix = TransactionClassificationService.classify(txNetflix);
  assert.equal(resNetflix.finalCategory, 'SUBSCRIPTION');
  assert.equal(resNetflix.identifiedMerchantId, 'MERCH_NETFLIX');

  // Zerodha investment
  const txZerodha = {
    amount: 10000,
    merchantName: 'Zerodha Broking Limited',
    isConfirmedPayment: true,
  };
  const resZerodha = TransactionClassificationService.classify(txZerodha);
  assert.equal(resZerodha.finalCategory, 'INVESTMENT');
  assert.equal(resZerodha.identifiedMerchantId, 'MERCH_ZERODHA');
  console.log('  ✓ Verified names & aliases mapped accurately for Food, Subscription, and Investment.');
}

// ---------------------------------------------------------------------------
// TEST 5: Keyword & Token Normalization Matching
// ---------------------------------------------------------------------------
console.log('5. Testing Keyword Normalization (Indian Oil Fuel Station)...');
{
  const txPetrol = {
    amount: 2000,
    merchantName: 'Indian Oil Fuel Station Highway Outlet Pvt Ltd',
    isConfirmedPayment: true,
  };
  const resPetrol = TransactionClassificationService.classify(txPetrol);
  assert.equal(resPetrol.finalCategory, 'PETROL');
  assert.equal(resPetrol.identifiedMerchantId, 'MERCH_INDIANOIL');
  console.log(`  ✓ Indian Oil Fuel Station normalized and mapped to ${resPetrol.finalCategory}.`);
}

// ---------------------------------------------------------------------------
// TEST 6: Unknown Merchant -> MISCELLANEOUS Fallback
// ---------------------------------------------------------------------------
console.log('6. Testing Unknown Merchant Fallback to MISCELLANEOUS...');
{
  const txUnknown = {
    amount: 850,
    merchantName: 'Random Unregistered Local Shop 12345',
    isConfirmedPayment: true,
  };
  const resUnknown = TransactionClassificationService.classify(txUnknown);
  assert.equal(resUnknown.finalCategory, 'MISCELLANEOUS');
  assert.equal(resUnknown.confidenceScore, 0);
  assert.equal(resUnknown.classificationMethod, 'FALLBACK_MISCELLANEOUS');
  console.log('  ✓ Unknown merchant safely falls back to MISCELLANEOUS.');
}

// ---------------------------------------------------------------------------
// TEST 7: Personal UPI Holder Name (Not a Business Merchant)
// ---------------------------------------------------------------------------
console.log('7. Testing Personal UPI Peer Transfer...');
{
  const txPersonal = {
    amount: 1500,
    upiId: '9876543210@paytm',
    upiHolderName: 'Rahul Sharma',
    isConfirmedPayment: true,
  };
  const resPersonal = TransactionClassificationService.classify(txPersonal);
  assert.equal(resPersonal.finalCategory, 'MISCELLANEOUS');
  console.log('  ✓ Personal peer UPI transfer safely classified as MISCELLANEOUS.');
}

// ---------------------------------------------------------------------------
// TEST 8: Missing Fields (Missing UPI ID, Missing MCC, Missing Name)
// ---------------------------------------------------------------------------
console.log('8. Testing Robustness to Missing Metadata...');
{
  // Missing UPI ID, has verified name
  const resNoUpi = TransactionClassificationService.classify({
    amount: 250,
    merchantName: 'Zepto',
    isConfirmedPayment: true,
  });
  assert.equal(resNoUpi.finalCategory, 'GROCERIES');

  // Missing Name, has MCC
  const resNoName = TransactionClassificationService.classify({
    amount: 500,
    mcc: '5541',
    isConfirmedPayment: true,
  });
  assert.equal(resNoName.finalCategory, 'PETROL');

  // Missing MCC, has verified UPI
  const resNoMcc = TransactionClassificationService.classify({
    amount: 350,
    upiId: 'swiggy@icici',
    isConfirmedPayment: true,
  });
  assert.equal(resNoMcc.finalCategory, 'FOOD');
  console.log('  ✓ Engine successfully classifies when individual signals are missing.');
}

// ---------------------------------------------------------------------------
// TEST 9: Conflicting Signals Handling
// ---------------------------------------------------------------------------
console.log('9. Testing Conflicting Signal Resolution...');
{
  // UPI says Apollo Pharmacy (MEDICINE), but MCC says Eating Places (FOOD)
  const txConflict = {
    amount: 400,
    upiId: 'apollo@upi',
    mcc: '5812', // FOOD
    isConfirmedPayment: true,
  };
  const resConflict = TransactionClassificationService.classify(txConflict);
  assert.equal(resConflict.finalCategory, 'MISCELLANEOUS');
  assert.ok(resConflict.conflictsDetected && resConflict.conflictsDetected.length > 0);
  assert.ok(resConflict.matchedRules.includes('REJECTED_SIGNAL_CONFLICT'));
  console.log('  ✓ Conflicting signals safely rejected to MISCELLANEOUS and logged for audit.');
}

// ---------------------------------------------------------------------------
// TEST 10: Multi-Category Merchant (Amazon: Shopping vs Subscription)
// ---------------------------------------------------------------------------
console.log('10. Testing Multi-Category Merchant Handling (Amazon)...');
{
  // Amazon with digital goods MCC 5815 -> SUBSCRIPTION
  const txAmazonSub = {
    amount: 299,
    upiId: 'amazonpay@apl',
    mcc: '5815', // Digital Goods / Media
    isConfirmedPayment: true,
  };
  const resAmazonSub = TransactionClassificationService.classify(txAmazonSub);
  assert.equal(resAmazonSub.finalCategory, 'SUBSCRIPTION');

  // Amazon with general department store MCC 5311 -> SHOPPING
  const txAmazonShop = {
    amount: 2500,
    upiId: 'amazonpay@apl',
    mcc: '5311',
    isConfirmedPayment: true,
  };
  const resAmazonShop = TransactionClassificationService.classify(txAmazonShop);
  assert.equal(resAmazonShop.finalCategory, 'SHOPPING');
  console.log('  ✓ Multi-category merchant correctly resolved based on MCC context.');
}

// ---------------------------------------------------------------------------
// TEST 11: Unconfirmed Payment (e.g. Scanned QR Without Payment)
// ---------------------------------------------------------------------------
console.log('11. Testing Unconfirmed Transaction Rejection...');
{
  const txUnconfirmed = {
    amount: 500,
    merchantName: 'Apollo Pharmacy',
    upiId: 'apollo@upi',
    isConfirmedPayment: false, // NOT confirmed
  };
  const resUnconfirmed = TransactionClassificationService.classify(txUnconfirmed);
  assert.equal(resUnconfirmed.finalCategory, 'MISCELLANEOUS');
  assert.ok(resUnconfirmed.matchedRules.includes('REJECTED_UNCONFIRMED_TRANSACTION'));
  console.log('  ✓ Unconfirmed payment rejected from categorization as required.');
}

// ---------------------------------------------------------------------------
// TEST 12: Decision Thresholds & Corroborating Evidence
// ---------------------------------------------------------------------------
console.log('12. Testing Decision Thresholds (High, Moderate with/without corroboration, Low)...');
{
  // High confidence (Score = 100) -> ACCEPT
  const high = ConfidenceScoringService.evaluateDecision(95, 1);
  assert.equal(high.assignedCategoryDecision, 'ACCEPT');
  assert.equal(high.tier, 'HIGH');

  // Moderate confidence (Score = 80) with 2 corroborating signals -> ACCEPT
  const modAccepted = ConfidenceScoringService.evaluateDecision(80, 2);
  assert.equal(modAccepted.assignedCategoryDecision, 'ACCEPT');
  assert.equal(modAccepted.tier, 'MODERATE');

  // Moderate confidence (Score = 80) with ONLY 1 signal -> REJECT_TO_MISCELLANEOUS
  const modRejected = ConfidenceScoringService.evaluateDecision(80, 1);
  assert.equal(modRejected.assignedCategoryDecision, 'REJECT_TO_MISCELLANEOUS');
  assert.equal(modRejected.tier, 'MODERATE');

  // Low confidence (Score = 55) -> REJECT_TO_MISCELLANEOUS
  const low = ConfidenceScoringService.evaluateDecision(55, 1);
  assert.equal(low.assignedCategoryDecision, 'REJECT_TO_MISCELLANEOUS');
  assert.equal(low.tier, 'LOW');
  console.log('  ✓ Decision thresholds enforce corroborating evidence requirements.');
}

// ---------------------------------------------------------------------------
// TEST 13: Previously Confirmed Merchant History Learning
// ---------------------------------------------------------------------------
console.log('13. Testing User-Confirmed Merchant History Learning...');
{
  const userId = 'usr_test_learning';
  const customMerchant = 'local tea vendor corner';

  // Initially unclassified
  const resInitial = TransactionClassificationService.classify({
    userId,
    amount: 40,
    merchantName: customMerchant,
    isConfirmedPayment: true,
  });
  assert.equal(resInitial.finalCategory, 'MISCELLANEOUS');

  // User manually confirms/overrides it to FOOD
  MerchantRepository.saveUserConfirmedMapping(userId, customMerchant, 'FOOD', false);

  // Subsequent transaction now recognizes history
  const resLearned = TransactionClassificationService.classify({
    userId,
    amount: 40,
    merchantName: customMerchant,
    isConfirmedPayment: true,
  });
  assert.equal(resLearned.predictedCategory, 'FOOD');
  console.log('  ✓ User-confirmed merchant mapping successfully learned and prioritized.');
}

// ---------------------------------------------------------------------------
// TEST 14: Centralized Category List Query
// ---------------------------------------------------------------------------
console.log('14. Testing Centralized Extensible Category Configuration...');
{
  const categories = CategorizationService.listCategories();
  assert.equal(categories.length, 16);
  const catIds = categories.map((c) => c.id);
  assert.ok(catIds.includes('MEDICINE'));
  assert.ok(catIds.includes('FOOD'));
  assert.ok(catIds.includes('GROCERIES'));
  assert.ok(catIds.includes('PETROL'));
  assert.ok(catIds.includes('INVESTMENT'));
  assert.ok(catIds.includes('ENTERTAINMENT'));
  assert.ok(catIds.includes('TRAVEL'));
  assert.ok(catIds.includes('MISCELLANEOUS'));
  console.log(`  ✓ All 16 spending categories configured with active metadata & colors.`);
}

console.log('\n=== ALL 14 CATEGORIZATION TEST SUITES PASSED WITH 100% SUCCESS! ===');

