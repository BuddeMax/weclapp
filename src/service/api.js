export const fetchCustomer = async (apiKey, domain, retries = 3) => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("AuthenticationToken", apiKey);
    myHeaders.append("Access-Control-Request-Method", "GET");
    myHeaders.append("Access-Control-Request-Headers", "AuthenticationToken, Content-Type");
    myHeaders.append("Origin", `https://${domain}.weclapp.com`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch(`https://${domain}.weclapp.com/webapp/api/v1/customer?properties=id,company`, requestOptions);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.text();
        const parsedResult = JSON.parse(result);
        return parsedResult.result;
    } catch (error) {
        if (retries > 0 && (error.message.includes('Failed to fetch') || error.message.includes('Network Error') || (error.response && error.response.status === 0))) {
            console.error('Netzwerk- oder CORS-Fehler erkannt, versuche erneut...');
            setTimeout(() => fetchCustomer(apiKey, domain, retries - 1), 1000);
        } else {
            console.error('Error fetching customer data:', error);
        }
    }
}

export const fetchSalesOrders = async (apiKey, domain, selectedCustomer, retries = 3) => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("AuthenticationToken", apiKey);
    myHeaders.append("Access-Control-Request-Method", "GET");
    myHeaders.append("Access-Control-Request-Headers", "AuthenticationToken, Content-Type");
    myHeaders.append("Origin", `https://${domain}.weclapp.com`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch(`https://${domain}.weclapp.com/webapp/api/v1/salesOrder?properties=id,commission&customerId-eq="${selectedCustomer}"`, requestOptions);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        const salesOrders = result.result.map(order => ({
            id: order.id,
            commission: order.commission
        }));
        console.log('Verkaufsaufträge erfolgreich geladen');
        return salesOrders;
    }  catch (error) {
    if (retries > 0 && (error.message.includes('Failed to fetch') || error.message.includes('Network Error') || (error.response && error.response.status === 0))) {
        console.error('Netzwerk- oder CORS-Fehler erkannt, versuche erneut...');
        await (async () => {
            fetchSalesOrders(apiKey, domain, selectedCustomer, retries - 1);
        })();
    } else {
        console.error('Fehler beim Abrufen der Verkaufsaufträge:', error);
    }
}
};