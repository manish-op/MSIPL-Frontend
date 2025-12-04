// MOCK API for testing frontend without backend

// Mock Data
const mockTickets = [
  {
    id: 1,
    serialNo: "417TTA0001",
    product: "APX-2000",
    faultDescription: "Battery connector faulty",
    status: "UNREPAIRED",
    assignedEngineerId: null,
    assignedEngineerName: null,
    faultRemarks: null
  },
  {
    id: 2,
    serialNo: "821HHA0023",
    product: "XPR-7550",
    faultDescription: "Display cracked",
    status: "UNREPAIRED",
    assignedEngineerId: null,
    assignedEngineerName: null,
    faultRemarks: null
  },
  {
    id: 3,
    serialNo: "333KKA9988",
    product: "SL-300",
    faultDescription: "No power",
    status: "UNREPAIRED",
    assignedEngineerId: "eng1",
    assignedEngineerName: "Engineer 1",
    faultRemarks: "Initial inspection done"
  }
];

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// get all unrepaired tickets
export async function getUnrepairedTickets() {
  await delay(500);
  console.log("MOCK API: getUnrepairedTickets called");
  return [...mockTickets];
}

// assign eng. to ticket
export async function assignEngineer(ticketId, engineerId) {
  await delay(500);
  console.log(`MOCK API: assignEngineer called for ticket ${ticketId} with engineer ${engineerId}`);
  const ticket = mockTickets.find(t => t.id === ticketId);
  if (ticket) {
    ticket.assignedEngineerId = engineerId;
    ticket.assignedEngineerName = `Engineer ${engineerId.replace('eng', '')}`; // Simple mock name
  }
  return { success: true };
}

// update ticket
export async function updateTicket(ticketId, payload) {
  await delay(500);
  console.log(`MOCK API: updateTicket called for ticket ${ticketId}`, payload);
  const ticket = mockTickets.find(t => t.id === ticketId);
  if (ticket) {
    Object.assign(ticket, payload);
  }
  return { success: true };
}

// check if part is available in warehouse
export async function checkPart(partNo) {
  await delay(500);
  console.log(`MOCK API: checkPart called for ${partNo}`);
  // Mock logic: parts starting with 'A' are available
  if (partNo.toUpperCase().startsWith('A')) {
      return { available: true, qty: 15 };
  }
  return { available: false, qty: 0 };
}

// create part request(from warehouse or PO)
export async function createPartRequest(ticketId, payload) {
  await delay(800);
  console.log(`MOCK API: createPartRequest called for ticket ${ticketId}`, payload);
  return { success: true, message: "Request created" };
}