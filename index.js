// Check if the browser supports service workers
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then(() => console.log("Service Worker registered successfully"))
            .catch((error) => console.error("Service Worker registration failed:", error));
    });
}

document.addEventListener("DOMContentLoaded",function(){
    const usernameInput= document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle= document.querySelector(".easy-progress");
    const mediumProgressCircle= document.querySelector(".medium-progress");
    const hardProgressCircle= document.querySelector(".hard-progress");
    const easyLabel = document.querySelector("#easy-label");
    const mediumLabel = document.querySelector("#medium-label");
    const hardLabel = document.querySelector("#hard-label");
    const cardStatsContainer= document.querySelector(".stats-cards");
    const searchButton=document.querySelector("#search-btn");
    
    function validateUserName(username){
        if(username.trim() === "") {
            alert("Username should not be empty");
            statsContainer.style.setProperty("display","none");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching) {
            alert("Invalid Username");
            // statsContainer.style.setProperty("display","none");
        }
        return isMatching;
         
    }
    
    // async function fetchUserDetails(username){

    //     try{
    //         searchButton.textContent = "Searching..";
    //         searchButton.disabled= true;
    //         const proxyUrl = 'https://cors-anywhere.herokuapp.com/' ;
    //         const targetURL='https://leetcode.com/graphql/';
    //     const myHeaders = new Headers();
    //     myHeaders.append("Content-Type","aplication/json");

    //     const graphql = JSON.stringify({
    //         query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
    //             variables: { "username": `${username}` }
    //     })
    //     const requestOptions={
    //         method:"POST",
    //         headers: myHeaders,
    //         body: graphql,
    //         redirect:"follow"
    //     };
    //     const response = await withTimeout(
    //     fetch(proxyUrl+targetURL, requestOptions),
    //     10000
    //   );
    //     if(!response.ok){
    //         throw new Error("Unable to fetch the User details");
    //     }
    //     const data = await response.json();
    //     console.log("logging data",data);
    //     }
    //     catch(error){
    //         statsContainer.innerHTML = `<p>No data found</p>`
    //     }
    //     finally{
    //         searchButton.textContent="Search";
    //         searchButton.disabled= false;
    //     }

    // }
    async function fetchUserDetails(username) {
        try {
          // Validate input
          
          validateUserName(username);
        //   if (!username || username.trim() === "") {
        //     statsContainer.innerHTML = `<p>Please enter a valid username.</p>`;
        //     searchButton.textContent = "Search";
        //     searchButton.disabled = false;
        //     return;
        //   }
      

          // Update button and UI
          statsContainer.style.setProperty("display","none");
          searchButton.textContent = "Searching...";
          searchButton.disabled = true;
        //   statsContainer.innerHTML = `<p>Loading user data...</p>`;
      
          // Proxy and target URLs
          const proxyUrl = 'https://cors-anywhere.herokuapp.com/' ;
          const targetURL = 'https://leetcode.com/graphql/';
      
          // Headers and body
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
      
          const graphql = JSON.stringify({
            query: `
              query userSessionProgress($username: String!) {
                allQuestionsCount {
                  difficulty
                  count
                }
                matchedUser(username: $username) {
                  submitStats {
                    acSubmissionNum {
                      difficulty
                      count
                      submissions
                    }
                    totalSubmissionNum {
                      difficulty
                      count
                      submissions
                    }
                  }
                }
              }
            `,
            variables: { username: `${username}` },
          });
      
          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: graphql,
            redirect: "follow",
          };
      
          // Fetch with timeout
          const response = await withTimeout(
            fetch(proxyUrl+targetURL, requestOptions),
            10000
          );
      
          // Handle non-OK responses
          if (!response.ok) {
            throw new Error("Unable to fetch the user details");
          }
      
          const parsedData = await response.json();
      
          // Display data
          console.log("logging data",parsedData);
          displayUserData(parsedData);
        //   const { allQuestionsCount, matchedUser } = data.data;
        //   if (matchedUser) {
        //     statsContainer.innerHTML = `
        //       <p>Easy Questions Solved: ${matchedUser.submitStats.acSubmissionNum[1].count}</p>
        //       <p>Medium Questions Solved: ${matchedUser.submitStats.acSubmissionNum[2].count}</p>
        //       <p>Hard Questions Solved: ${matchedUser.submitStats.acSubmissionNum[3].count}</p>
        //     `;
        //   } else {
        //     statsContainer.innerHTML = `<p>No user found for username: ${username}</p>`;
        //   }
        } catch (error) {
          console.error("Error fetching data:", error);
          statsContainer.innerHTML = `<p>${error.message || "An unexpected error occurred"}</p>`;
        } finally {
          searchButton.textContent = "Search";
          searchButton.disabled = false;
        }
      }
      
    //   Timeout function
      function withTimeout(promise, timeout = 5000) {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timed out")), timeout)
        );
        return Promise.race([promise, timeoutPromise]);
      }

    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }
    
    function displayUserData(parsedData){
        statsContainer.style.removeProperty("display");
        const totalQues = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues = parsedData.data.allQuestionsCount[3].count;

        const solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

        const cardsData = [
            {label: "Overall Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
            {label: "Overall Easy Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
            {label: "Overall Medium Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
            {label: "Overall Hard Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions },
        ];

        cardStatsContainer.innerHTML = cardsData.map(
            data => 
                    `<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>`
        ).join("")
    }
    statsContainer.style.setProperty("display","none");
    searchButton.addEventListener('click',function(){
        const username = usernameInput.value;
        console.log("logging username:",username);
        if(validateUserName(username)){
            fetchUserDetails(username);
        }
    })
})