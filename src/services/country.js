async function detectAndStoreCountry() {
  const storedCountry = localStorage.getItem("userCountry");
  const storedTimestamp = localStorage.getItem("countryTimestamp");
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000; // 24 saat milisaniye cinsinden

  if (
    storedCountry &&
    storedTimestamp &&
    now - parseInt(storedTimestamp) < ONE_DAY
  ) {
    return storedCountry;
  }

  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    const country = data.country;

    localStorage.setItem("userCountry", country);
    localStorage.setItem("countryTimestamp", now.toString());

    return country;
  } catch (error) {
    console.error("Ülke tespiti sırasında hata:", error);
    return null;
  }
}

export function getUserCountry() {
  return detectAndStoreCountry();
}
