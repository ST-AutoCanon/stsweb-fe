const API_KEY = process.env.REACT_APP_API_KEY;
const meId = JSON.parse(
  localStorage.getItem("dashboardData") || "{}"
).employeeId;

const headersWithoutJson = {
  "x-api-key": API_KEY,
  "x-employee-id": meId,
};

export async function postVoiceDialog(audioBlob, step) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "step.webm");
  formData.append("step", String(step));

  // Updated endpoint path
  const url = `${process.env.REACT_APP_BACKEND_URL}/voice-dialog`;

  const res = await fetch(url, {
    method: "POST",
    headers: headersWithoutJson,
    body: formData,
  });
  return await res.json();
}

export async function postVoiceFinal(data) {
  const url = `${process.env.REACT_APP_BACKEND_URL}/voice-final`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...headersWithoutJson,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      purpose_key_points: data.purpose,
      client_company: data.client_company,
      contact_person: data.contact_person,
      description: data.description,
      action_points: data.action_points,
      assigned_to: data.assigned_to,
      follow_up_date: data.follow_up_date,
    }),
  });
  return await res.json();
}
