import axios from 'axios';

async function testSignup() {
  try {
    const data = {
      name: "Test Student",
      email: "studenttest3@example.com",
      password: "password",
      role: "STUDENT",
      institutionName: "Test School",
      location: "Test City",
      gradesInterested: ["Engineering Mathematics"],
      assignedTeacherId: 1
    };
    
    const response = await axios.post('http://localhost:8080/api/auth/signup', data);
    console.log("SUCCESS:", response.data);
  } catch (error) {
    console.error("FAILED:", error.response ? error.response.data : error.message);
  }
}

testSignup();
