// Generate unique link function
const GenerateLink = () => {return (new Date()).getTime()};

// Generate game link
Input.invitationLink.value = `https://matteoo34.github.io/hangit.io/?g=${GenerateLink()}`;

// Generate game link (local test)
// Input.invitationLink.value = `http://localhost/hangit.io/?g=${GenerateLink()}`
// Generate game link (local test 2)
//  Input.invitationLink.value = `http://localhost:2021/?g=${GenerateLink()}`