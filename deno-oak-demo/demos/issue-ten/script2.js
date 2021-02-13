const axios = require("axios");

const data = {
  items: [
    {
      id: "5e798f61ace8c215633a1952",
      status: "Pending",
      requestByAdmin: true,
      partyId: 10170,
      amount: { value: 100, currency: "₱" },
      role: "Partner",
      description: "deducting extra free 100 for campaign",
      createdAt: { $date: "2020-03-24T06:46:57.195Z" },
      __v: 0,
      statusDateTimes: { processed: { $date: "2020-03-24T04:53:21.898Z" } },
    },
    {
      id: "5e798f7dace8c215633a1953",
      status: "Pending",
      requestByAdmin: true,
      partyId: 8120,
      amount: { value: 50, currency: "₱" },
      role: "Partner",
      description: "deducting extra free 50 for campaign",
      createdAt: { $date: "2020-03-24T06:46:57.195Z" },
      __v: 0,
      statusDateTimes: { processed: { $date: "2020-03-24T04:54:09.220Z" } },
    },
    {
      id: "5e798f9cace8c215633a1954",
      status: "Pending",
      requestByAdmin: true,
      partyId: 9255,
      amount: { value: 150, currency: "₱" },
      role: "Partner",
      description: "deducting extra free 150 for campaign",
      createdAt: { $date: "2020-03-24T06:46:57.195Z" },
      __v: 0,
      statusDateTimes: { processed: { $date: "2020-03-24T04:54:54.193Z" } },
    },
    {
      id: "5e7c34193ba30e29afea357f",
      status: "Pending",
      requestByAdmin: true,
      partyId: 12304,
      amount: { value: 50, currency: "₱" },
      role: "Partner",
      description: "deduction",
      createdAt: { $date: "2020-03-26T06:46:57.195Z" },
      __v: 0,
      statusDateTimes: { processed: { $date: "2020-03-26T04:55:18.895Z" } },
    },
    {
      id: "5e8758dfde3bd932884d5a4a",
      status: "Pending",
      requestByAdmin: true,
      partyId: 5806,
      amount: { value: 50, currency: "₱" },
      role: "Partner",
      description: "Free 50",
      statusDateTimes: { processed: { $date: "2020-04-03T15:40:21.484Z" } },
    },
    {
      id: "5e8758dfde3bd932884d5a4b",
      status: "Pending",
      requestByAdmin: true,
      partyId: 1204,
      amount: { value: 50, currency: "₱" },
      role: "Partner",
      description: "Free 50",
      statusDateTimes: { processed: { $date: "2020-04-03T15:40:25.447Z" } },
    },
    {
      id: "5e8c63127a8bc32b75106373",
      status: "Pending",
      requestByAdmin: true,
      partyId: 5806,
      amount: { value: 11, currency: "₱" },
      role: "Partner",
      description: "Free 50",
      createdAt: { $date: "2020-04-07T11:25:06.243Z" },
      statusDateTimes: { processed: { $date: "2020-04-07T11:25:09.299Z" } },
    },
    {
      id: "5e8c63167a8bc32b75106374",
      status: "Pending",
      requestByAdmin: true,
      partyId: 1204,
      amount: { value: 50, currency: "₱" },
      role: "Partner",
      description: "Free 50",
      createdAt: { $date: "2020-04-07T11:25:10.641Z" },
      statusDateTimes: { processed: { $date: "2020-04-07T11:25:12.227Z" } },
    },
    {
      id: "5e8c6a34fc70b02becf2df14",
      status: "Pending",
      requestByAdmin: true,
      partyId: 2499,
      amount: { value: 50, currency: "₱" },
      role: "Partner",
      description: "Free 50",
      createdAt: { $date: "2020-04-07T11:55:32.077Z" },
      statusDateTimes: { processed: { $date: "2020-04-07T11:55:41.176Z" } },
    },
    {
      id: "5e8c6a5cfc70b02becf2df16",
      status: "Pending",
      requestByAdmin: true,
      partyId: 11366,
      amount: { value: 50, currency: "₱" },
      role: "Partner",
      description: "Free 50",
      createdAt: { $date: "2020-04-07T11:56:12.089Z" },
      statusDateTimes: { processed: { $date: "2020-04-07T11:56:25.109Z" } },
    },
    {
      id: "5e8c6a6afc70b02becf2df17",
      status: "Pending",
      requestByAdmin: true,
      partyId: 4206,
      amount: { value: 50, currency: "₱" },
      role: "Partner",
      description: "Free 50",
      createdAt: { $date: "2020-04-07T11:56:26.140Z" },
      statusDateTimes: { processed: { $date: "2020-04-07T11:56:47.599Z" } },
    },
    {
      id: "5e8c6a80fc70b02becf2df18",
      status: "Pending",
      requestByAdmin: true,
      partyId: 10347,
      amount: { value: 50, currency: "₱" },
      role: "Partner",
      description: "50Campiagn Free 50",
      createdAt: { $date: "2020-04-07T11:56:48.650Z" },
    },
    {
      id: "5e8c6a85fc70b02becf2df1a",
      status: "Pending",
      requestByAdmin: true,
      partyId: 6965,
      amount: { value: 0, currency: "₱" },
      role: "Partner",
      description: "Free 50",
      createdAt: { $date: "2020-04-07T11:56:53.073Z" },
      statusDateTimes: { processed: { $date: "2020-04-07T11:56:54.390Z" } },
    },
  ],
};

(async () => {
  const headers = {
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQxOTAsInBhcnR5SWQiOjkwMDAwMDE5fQ.eGTNYA9a_YZyYKmhoeZz9E3KTJqeQqZpSSdZL77mK98",
  };

  let c = 18;
  for (const d of data.items) {
    ++c;

    const b0 = await axios.get(
      `http://localhost:8093/management/v1/accounting/balance/${d.partyId}`,
      { headers },
    );

    try {
      await axios.put(
        `http://localhost:8093/management/v1/cash-out/${d.id}`,
        {
          status: "Processed",
          description: `This is #${c} not deducted from partner issue test case!`,
        },
        {
          headers,
        },
      );

      const b1 = await axios.get(
        `http://localhost:8093/management/v1/accounting/balance/${d.partyId}`,
        { headers },
      );

      console.info(
        `Case #${c}`,
        d.id,
        d.partyId,
        d.amount.currency + d.amount.value,
        b0.data[3].displayValue,
        b1.data[3].displayValue,
      );
    } catch (error) {
      console.info(
        `Case #${c}`,
        d.id,
        d.partyId,
        d.amount.currency + d.amount.value,
        b0.data[3].displayValue,
        error.response.data,
      );
    }
  }
})();
