const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const axios = require('axios');
const qs = require('qs');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const globaltoken = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IlRKOF8zSGhRa25NcVpYUU1mY0JQQVR2S3VMT2ZQMm0wbWhQeWtmaktRZXciLCJhbGciOiJSUzI1NiIsIng1dCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyIsImtpZCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82MDZjNjFjMy05MmJlLTQ5ZDUtOGNjNy0yNTIxNTEyZWRiNjEvIiwiaWF0IjoxNzM4MjIxMDUyLCJuYmYiOjE3MzgyMjEwNTIsImV4cCI6MTczODMwNzc1MywiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhaQUFBQW5XdTY0ZDV1czgvblNLMUQ3SVd2Z1N2ejRqS2VkcEdoc0tkRWROaGkzOS9SOTArK2NLaERLS05jU2VEeVZOdkIiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIEV4cGxvcmVyIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IlRlYW0iLCJnaXZlbl9uYW1lIjoiRGV2ZWxvcG1lbnQiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIyNDAxOjQ5MDA6MWM0NTpjY2Y0OmU1ZDE6YjY2OTozNDBlOjJhYSIsIm5hbWUiOiJEZXZlbG9wbWVudCBUZWFtIiwib2lkIjoiMTM2MGJjNzktYTBlMi00YjcwLTg5YWYtZGMxYjAzNWEzMDM0IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDA0M0Q2RTlFRDgiLCJyaCI6IjEuQVQwQXcyRnNZTDZTMVVtTXh5VWhVUzdiWVFNQUFBQUFBQUFBd0FBQUFBQUFBQUE5QVBZOUFBLiIsInNjcCI6IkNoYW5uZWwuUmVhZEJhc2ljLkFsbCBDaGFubmVsTWVzc2FnZS5TZW5kIE5vdGlmaWNhdGlvbnMuUmVhZFdyaXRlLkNyZWF0ZWRCeUFwcCBvcGVuaWQgcHJvZmlsZSBUZWFtLkNyZWF0ZSBUZWFtLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkIGVtYWlsIiwic2lkIjoiMDAxM2RlMDktNGNmYS1iN2U3LTIyNjctMmI2MGRmODQyNzU1Iiwic3ViIjoiUTRlRzlNMFhSUk0zNHVTOE9OM192MEo4M21oQXREWFdiQWlqcW1EdnlnayIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBUyIsInRpZCI6IjYwNmM2MWMzLTkyYmUtNDlkNS04Y2M3LTI1MjE1MTJlZGI2MSIsInVuaXF1ZV9uYW1lIjoiZGV2dGVhbUBjb25uZWN0aWN1cy5pbiIsInVwbiI6ImRldnRlYW1AY29ubmVjdGljdXMuaW4iLCJ1dGkiOiJSbFVULUlpLU9VR0ZmdGNXR2VZeEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2NjIjpbIkNQMSJdLCJ4bXNfZnRkIjoiczg5S1JsSFBiN212Q0RYLWFNZzNEY3ZMSzNEQWVSbW5NcVdEeFR6ZndwWSIsInhtc19pZHJlbCI6IjEgNCIsInhtc19zc20iOiIxIiwieG1zX3N0Ijp7InN1YiI6IndOdVF3Uk9mUTk4bkRwUHB5QVVLTEl1VWh4VVI5eXpfZksxdno4RDR5RnMifSwieG1zX3RjZHQiOjE1NTg3NjE1Mjh9.cQbz2-7E8HfhuyRsUS-0K-6uwNoInh1Y7Haqz-aPFvw4gqAWDbFtcoAXrZsz4PxKz_GBqToToh0yT_NzXUJ_GkJErnn0aochy2oQB3ZQxk7-dPhLhtnGEkSzztrCy79QgpSd8426_UF0nYpcA7F26op2f7VGbm2p9mVZQB7XkulGBa9WLiPDVXJM_1bBV_qdqL7HULlkRxWQGMpl-shfR3UA6t7F9NPXlBUnauSi35sdPspZUy_Nu5fDVweUc8IJHO7WQxesdNJWE8GiFojkmltSnQk4SeIbXeqjLo2ZleE3PflFVFFTHOCYvQDGCoPUWvuqYjCCXm-eIXUw-DNSVg"

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'to_do_app'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL');
});

// Pass the db connection to routes
app.use('/api', (req, res, next) => {
    req.db = db;
    next();
});

app.use('/api', routes);

// Azure AD and Microsoft Teams API details
const clientId = 'dab42f06-a5f3-4cea-bd14-828092752e6d';
const clientSecret = 'cd909d4e-0d9a-4746-9456-649dca13e2d0';
const tenantId = '606c61c3-92be-49d5-8cc7-2521512edb61';

// OAuth2 token endpoint
const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

// Get access token
async function getAccessToken() {
    try {
        const response = await axios.post(tokenUrl, qs.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            scope: 'https://graph.microsoft.com/.default',
            grant_type: 'client_credentials'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
    }
}

// Get Teams list
async function getTeamsList(accessToken) {
    try {
        const response = await axios.get('https://graph.microsoft.com/v1.0/me/joinedTeams', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting Teams list:', error.response ? error.response.data : error.message);
    }
}

let lastKnownTeams = [];

// async function checkForTeamChanges() {
//     try {
//         const accessToken = "eyJ0eXAiOiJKV1QiLCJub25jZSI6Ikkza3hjUk5jcE1ONEV3ZDBJYjlmWm5yRHM4eHUzeDV1M1otZVdzMWp1d00iLCJhbGciOiJSUzI1NiIsIng1dCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyIsImtpZCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82MDZjNjFjMy05MmJlLTQ5ZDUtOGNjNy0yNTIxNTEyZWRiNjEvIiwiaWF0IjoxNzM4MTUzNjkxLCJuYmYiOjE3MzgxNTM2OTEsImV4cCI6MTczODI0MDM5MywiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhaQUFBQXRldEFJREdyVyttZHRCUmlYcDJJYnVrYUxMOXhFdngreTJJalZEZU9hRGUxQUFBd2JEZktmR0wrOEI5eGRxemNGNFl6cjlsTkhvOWN5aE12ZzhVMVBkbHdEOWlpenNZZlJHVUI0bWtRNzVrPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiVGVhbSIsImdpdmVuX25hbWUiOiJEZXZlbG9wbWVudCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjI0MDE6NDkwMDoxZmYxOmY1NGE6NTBhZTo5NjA4OmNjMjM6YTU1OCIsIm5hbWUiOiJEZXZlbG9wbWVudCBUZWFtIiwib2lkIjoiMTM2MGJjNzktYTBlMi00YjcwLTg5YWYtZGMxYjAzNWEzMDM0IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDA0M0Q2RTlFRDgiLCJyaCI6IjEuQVQwQXcyRnNZTDZTMVVtTXh5VWhVUzdiWVFNQUFBQUFBQUFBd0FBQUFBQUFBQUE5QVBZOUFBLiIsInNjcCI6Im9wZW5pZCBwcm9maWxlIFVzZXIuUmVhZCBlbWFpbCBUZWFtLlJlYWRCYXNpYy5BbGwiLCJzaWQiOiIwMDEzOGZlOS1mNjI5LWE4MDUtOGRmZi0xMGYwOTAwMjkwZmUiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJRNGVHOU0wWFJSTTM0dVM4T04zX3YwSjgzbWhBdERYV2JBaWpxbUR2eWdrIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiNjA2YzYxYzMtOTJiZS00OWQ1LThjYzctMjUyMTUxMmVkYjYxIiwidW5pcXVlX25hbWUiOiJkZXZ0ZWFtQGNvbm5lY3RpY3VzLmluIiwidXBuIjoiZGV2dGVhbUBjb25uZWN0aWN1cy5pbiIsInV0aSI6ImpCZmZsMEhHTFVDd1VaMVpvdk1TQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfY2MiOlsiQ1AxIl0sInhtc19mdGQiOiJjdGJyY0lTNVNjVXVnX1B4djF1cUU4Nl8yakp1VXZrd3dDRFpmOU9EcU1zIiwieG1zX2lkcmVsIjoiMiAxIiwieG1zX3NzbSI6IjEiLCJ4bXNfc3QiOnsic3ViIjoid051UXdST2ZROThuRHBQcHlBVUtMSXVVaHhVUjl5el9mSzF2ejhENHlGcyJ9LCJ4bXNfdGNkdCI6MTU1ODc2MTUyOH0.QjyVLVW06m9B8S_-3X1tmMkZpMBbY5dsUxaVdYfWFZMwc4io56niYR9uY5L7mZL0ku7M-sRykZWalqMdOqGiDqWtGbBWh_RIK9Q-BshLTiOnCkMDNYWhSyMLeooXVItgVNf3hc2LhGz_UX3PgIOg9bIIo_UN5mrk-J5nf3kexjGlgPkxF5N7mV7V5K-eIRrJoImuJmh39FFdaAobdpv3ZmiO0X2z4TWIqwvl90HJ7YGqYNM9T7FywZUp1bxKSClQrFAErct6IsGKQ8R-yF5ZLGMt29GCorKYBIM0r-zf13hjPU7HkXGGwA__f83Q0G_vXEVkxD-uFNzbAUZstcxaOA";
//         const teams = await getTeamsList(accessToken);

//         const newTeams = teams.value.filter(team => !lastKnownTeams.some(lastTeam => lastTeam.id === team.id));

//         if (newTeams.length > 0) {
//             console.log('New Teams Found:', newTeams);
//             lastKnownTeams = teams.value;
//             newTeams.forEach((team) => {
//                 addTeamToDatabase(team);  
//             });
//         }
//     } catch (error) {
//         console.error('Error checking for team changes:', error.message);
//     }
// }

function addTeamToDatabase(team) {
    const query = 'INSERT INTO teams (id, name) VALUES (?, ?)';
    db.query(query, [team.id, team.displayName], (err, result) => {
        if (err) {
            console.error('Error adding team to database:', err);
        } else {
            console.log('Team added to database:', result);
        }
    });
}

// setInterval(checkForTeamChanges, 10000);

app.get('/teams', async (req, res) => {
    try {
        const accessToken = globaltoken;
        const teams = await getTeamsList(accessToken);
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Teams', error: error.message });
    }
});


// Fetch channels for a specific team
async function getChannelsForTeam(teamId, accessToken) {
    try {
        accessToken = globaltoken
        const response = await axios.get(`https://graph.microsoft.com/v1.0/teams/${teamId}/channels`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.value;  // Return channels array
    } catch (error) {
        console.error('Error fetching channels:', error.response ? error.response.data : error.message);
    }
}

// Save channels to the database
async function saveChannelsToDatabase(teamId, channels) {
    const query = 'INSERT INTO channels (id, team_id, name, description) VALUES (?, ?, ?, ?)';
    for (const channel of channels) {
        db.query(query, [channel.id, teamId, channel.displayName, channel.description || ''], (err, result) => {
            if (err) {
                console.error('Error inserting channel into database:', err);
            } else {
                console.log('Inserted channel:', result);
            }
        });
    }
}

app.get('/channels/:teamId', async (req, res) => {
    const { teamId } = req.params;
    console.log(teamId)
    try {
        const accessToken = globaltoken;
        const channels = await getChannelsForTeam(teamId, accessToken);

        // Save channels to the database
        await saveChannelsToDatabase(teamId, channels);

        res.json({ message: 'Channels saved successfully', channels });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching or saving channels', error: error.message });
    }
});


async function createTeam(teamData) {
    const accessToken = globaltoken;
    try {
        const response = await axios.post('https://graph.microsoft.com/v1.0/teams', teamData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const team = response.data;

        // Save the created team to your database
        const query = 'INSERT INTO teams (id, name) VALUES (?, ?)';
        const values = [team.id, team.displayName];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error saving team to database:', err);
            } else {
                console.log('Team saved to database');
            }
        });

        return team;
    } catch (error) {
        console.error('Error creating team:', error.response ? error.response.data : error.message);
    }
}

// API route to handle team creation
app.post('/create-team', async (req, res) => {
    const { name } = req.body;

    // const teamData = {
    //     "template@odata.bind: "https://graph.microsoft.com/v1.0/teamsTemplates('standard')",
    //     "displayName": name,
    //     "description": description,
    //     // "visibility": visibility,
    //     // "members": [
    //     //     {
    //     //         "@odata.type": "#microsoft.graph.aadUserConversationMember",
    //     //         "roles": ["owner"],
    //     //         "user@odata.bind": "https://graph.microsoft.com/v1.0/users/{userId}" // Replace with valid userId
    //     //     }
    //     // ]
    // };

    const teamData = {
        "template@odata.bind": "https://graph.microsoft.com/v1.0/teamsTemplates('standard')",  // Template for team creation
        "displayName": name,                           // Team name
    };

    const team = await createTeam(teamData);

    if (team) {
        res.status(201).json({ message: 'Team created successfully', team });
    } else {
        res.status(500).json({ message: 'Error creating team' });
    }
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//Create channel
async function createChannel(teamId, channelData) {
    const accessToken = globaltoken;
    try {
        const response = await axios.post(`https://graph.microsoft.com/v1.0/teams/${teamId}/channels`, channelData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data; // Return created channel data
    } catch (error) {
        console.error('Error creating channel:', error.response ? error.response.data : error.message);
        return null;
    }
}

app.post('/create-channel', async (req, res) => {
    const { teamId, displayName, description } = req.body;

    if (!teamId || !displayName) {
        return res.status(400).json({ message: "teamId and displayName are required" });
    }

    const channelData = {
        displayName,
        description
    };

    const channel = await createChannel(teamId, channelData);

    if (channel) {
        res.status(201).json({ message: "Channel created successfully", channel });
    } else {
        res.status(500).json({ message: "Error creating channel" });
    }
});


async function deleteChannel(teamId, channelId) {
    const accessToken = globaltoken;
    try {
        const response = await axios.delete(`https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return { success: true, message: "Channel deleted successfully" };
    } catch (error) {
        console.error('Error deleting channel:', error.response ? error.response.data : error.message);
        return { success: false, error: error.response ? error.response.data : error.message };
    }
}

// API Route to Delete a Channel
app.delete('/delete-channel', async (req, res) => {
    const { teamId, channelId } = req.body;

    if (!teamId || !channelId) {
        return res.status(400).json({ message: "teamId and channelId are required" });
    }

    const result = await deleteChannel(teamId, channelId);

    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(500).json(result);
    }
});


//------------------------------------------------------------------------------------------------------------------------------------
// Send msg
async function sendMessageToChannel(teamId, channelId, message) {
    const accessToken = globaltoken;
    try {
        const response = await axios.post(
            `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/messages`,
            { body: { content: message } },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data; // Return sent message data
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
        return null;
    }
}

// API Route to Send a Message to a Channel
app.post('/send-message', async (req, res) => {
    const { teamId, channelId, message } = req.body;

    if (!teamId || !channelId || !message) {
        return res.status(400).json({ message: "teamId, channelId, and message are required" });
    }

    const result = await sendMessageToChannel(teamId, channelId, message);

    if (result) {
        res.status(200).json({ message: "Message sent successfully", result });
    } else {
        res.status(500).json({ message: "Error sending message" });
    }
});

// async function sendTeamMessage(accessToken) {
//     try {
//         const response = await axios.get('https://graph.microsoft.com/v1.0/me/joinedTeams', {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error getting Teams list:', error.response ? error.response.data : error.message);
//     }
// }


async function createissue(teamId, channelData) {
    try {
        const response = await axios.post(`https://graph.microsoft.com/v1.0/teams/${teamId}/channels`, channelData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data; // Return created channel data
    } catch (error) {
        console.error('Error creating channel:', error.response ? error.response.data : error.message);
        return null;
    }
}


const JIRA_BASE_URL = 'https://ujjwal27022004.atlassian.net/rest/api/3/issue';
const JIRA_EMAIL = 'ujjwal27022004@gmail.com'; // Replace with your Jira account email
const JIRA_API_TOKEN = 'ATATT3xFfGF0aZ9BTIUG978VNsD_Hag6JlYSdef4ttOHwPL3izRMHVuCNv40y8JRmLwhuXVUuvoYQjXKVklb_Mx6vWYllORcR6uYfqGyDGUWbryKKdXAG8yefnUk3M5dRmPFr609VqDwCwZ47KSSeDuq5qLxATqFOVQMP_rdstM2X_8wl9qGRtk=1C9D48C4'; // Replace with your Jira API token
const JIRA_PROJECT_KEY = 'WTS'; // Replace with your actual Jira project key

// Function to create an issue in JIRA
async function createJiraIssue(description, issueType) {
    const issueData = {
        fields: {
            project: { key: JIRA_PROJECT_KEY },
            summary: "New Issue Created via API",
            description: {
                type: "doc",
                version: 1,
                content: [
                    {
                        type: "paragraph",
                        content: [
                            {
                                text: description,
                                type: "text"
                            }
                        ]
                    }
                ]
            },
            issuetype: { name: issueType }
        }
    };

    try {
        const response = await axios.post(JIRA_BASE_URL, issueData, {
            auth: { username: JIRA_EMAIL, password: JIRA_API_TOKEN },
            headers: { 'Content-Type': 'application/json' }
        });

        return response.data; 
    } catch (error) {
        console.error('Error creating JIRA issue:', error.response ? error.response.data : error.message);
        return null;
    }
}

// API Route to Create an Issue in JIRA
app.post('/create-jira-issue', async (req, res) => {
    const { description, issueType } = req.body;

    if (!description || !issueType) {
        return res.status(400).json({ message: "description and issueType are required" });
    }

    const issue = await createJiraIssue(description, issueType);

    if (issue) {
        res.status(201).json({ message: "JIRA issue created successfully", issue });
    } else {
        res.status(500).json({ message: "Error creating JIRA issue" });
    }
    const obj = {
        teamId: "b94dc17d-7a42-45b4-bb8a-8ccf51342e88",
        channelId: "19:309d952cce5745c889faa9ecb705b041@thread.tacv2",
    }
    console.log(obj.teamId);
    console.log(obj.channelId)
    sendMessageToChannel(obj.teamId, obj.channelId, "New issue has been Added to the JIRA")

});


app.get('/get-jira-issues', async (req, res) => {
    try {
      const authHeader = JIRA_API_TOKEN
      const maxResults = 1000;
      const jql = "ORDER BY created DESC"; // Broad query to get all issues (sorted by creation)
  
      const response = await axios.get(
        "https://ujjwal27022004.atlassian.net/rest/api/3/search?jql=project=WTS&maxResults=1000",
        {
          headers: {
            'Authorization': "dWpqd2FsMjcwMjIwMDRAZ21haWwuY29tOkFUQVRUM3hGZkdGMGFaOUJUSVVHOTc4Vk5zRF9IYWc2SmxZU2RlZjR0dE9Id1BMM2l6Uk1IVnVDTnY0MHk4SlJtTHdodVhWVXV2b1lRalhLVmtsYl9NeDZ2V1lsbE9SY1I2dVlmcUd5REdVV2JyeUtLZFhBRzh5ZWZuVWszTTVkUm1QRnI2MDlWcUR3Q3daNDdLU1NlRHVxNXFMeEFUcUZPVlFNUF9yZHN0TTJYXzh3bDlxR1J0az0xQzlENDhDNA==",
            'Content-Type': 'application/json',
          }
        }
      );
  
      console.log('Response Data:', response.data); // Log full response
      console.log('Response Status:', response.status); // Log the HTTP status
  
      if (response.data.issues && response.data.issues.length > 0) {
        res.json(response.data); // Return issues if found
      } else {
        res.status(404).json({ message: "No issues found." });
      }
  
    } catch (error) {
      console.error('Error fetching Jira issues:', error.response ? error.response.data : error.message);
      res.status(500).send('Error fetching Jira issues');
    }
  });
  
  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
