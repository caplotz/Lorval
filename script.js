import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://rmxgjsvpmnganddmnpdm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJteGdqc3ZwbW5nYW5kZG1ucGRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NDMwNTgsImV4cCI6MjA3MTIxOTA1OH0.8q1RGvHvu3pu6BZo1DT3texcMvXMLNCm6gpwsR8lpDQ";

const supabase = createClient(supabaseUrl, supabaseKey);

// ===== INSCRIPTION =====
export async function signUpCivil(email, password, fullName, username, ssn) {
  return signUpBase(email, password, {
    full_name: fullName,
    username,
    ssn,
    role: "civil",
  }, "dashboard_civil.html");
}

export async function signUpEntreprise(email, password, fullName, company_code) {
  return signUpBase(email, password, {
    full_name: fullName,
    company_code,
    role: "entreprise",
  }, "dashboard_entreprise.html");
}

async function signUpBase(email, password, extraData, redirectUrl) {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    const user = data.user;
    const { error: insertError } = await supabase.from("profiles").insert([
      { user_id: user.id, email, ...extraData }
    ]);
    if (insertError) throw insertError;

    alert("✅ Compte créé avec succès !");
    window.location.href = redirectUrl;
  } catch (err) {
    alert("❌ Erreur inscription : " + err.message);
  }
}

// ===== CONNEXION =====
export async function signInCivil(email, password) {
  return signInBase(email, password, "dashboard_civil.html");
}

export async function signInEntreprise(email, password) {
  return signInBase(email, password, "dashboard_entreprise.html");
}

export async function signInPolice(matricule, password) {
  try {
    // Auth avec email fictif = matricule@police.lorval
    const { data, error } = await supabase.auth.signInWithPassword({
      email: matricule + "@police.lorval",
      password,
    });
    if (error) throw error;
    window.location.href = "dashboard_police.html";
  } catch (err) {
    alert("❌ Erreur connexion police : " + err.message);
  }
}

export async function signInGouvernement(email, password1, password2) {
  if (password1 !== password2) {
    return alert("❌ Les 2 mots de passe doivent correspondre !");
  }
  return signInBase(email, password1, "dashboard_gouv.html");
}

export async function signInAdmin(email, p1, p2, p3) {
  const finalPass = p1 + "-" + p2 + "-" + p3;
  return signInBase(email, finalPass, "dashboard_admin.html");
}

async function signInBase(email, password, redirectUrl) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    alert("✅ Connecté !");
    window.location.href = redirectUrl;
  } catch (err) {
    alert("❌ Erreur connexion : " + err.message);
  }
}
