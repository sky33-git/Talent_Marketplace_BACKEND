export const BASE_API = `http://localhost:5173`
export const BACKEND_API = `http://localhost:3000`




// function parseResumeText(text) {
//     // Primitive fields
//     const nameRegex = /(?:Name|Candidate|Profile):?\s*([A-Z][a-z]+\s[A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/i;
//     const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
//     const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)*\d{6,10}/;
//     const countryRegex = /(?:Country|Location|Address):?\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i;

//     const linkedInRegex = /https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
//     const githubRegex = /https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+/i;
//     const portfolioRegex = /(https?:\/\/(www\.)?(?!linkedin\.com|github\.com)[a-zA-Z0-9./?=_-]+)/i;

//     const categoriesRegex = /Categories?:\s*([A-Za-z0-9\s,]+)/i;
//     const skillsRegex = /Skills?:\s*([\w\s+#,.()-]+)/i;
//     const titleRegex = /(Title|Designation|Current Position):\s*([A-Za-z\s,.-]+)/i;

//     // Extract primitives
//     const nameMatch = text.match(nameRegex);
//     const emailMatch = text.match(emailRegex);
//     const phoneMatch = text.match(phoneRegex);
//     const countryMatch = text.match(countryRegex);
//     const linkedInMatch = text.match(linkedInRegex);
//     const githubMatch = text.match(githubRegex);
//     const portfolioMatch = text.match(portfolioRegex);
//     const categoriesMatch = text.match(categoriesRegex);
//     const skillsMatch = text.match(skillsRegex);
//     const titleMatch = text.match(titleRegex);

//     // Projects extraction
//     const projectsSectionRegex = /Projects?:\s*([\s\S]*?)(Experience|Education|Languages|$)/i;
//     const projectsSectionMatch = text.match(projectsSectionRegex);

//     let projects = [];
//     if (projectsSectionMatch) {
//         const projectsText = projectsSectionMatch[1].trim();
//         const projectEntries = projectsText.split(/\n{2,}/);

//         projects = projectEntries.map((entry, i) => {
//             const titleMatch = entry.match(/Title:?\s*(.*)/i);
//             const techStackMatch = entry.match(/Tech Stack:?\s*([\w\s,#+-]+)/i);
//             const projectLiveURLMatch = entry.match(/Project URL:?\s*(https?:\/\/[^\s]+)/i);
//             const descriptionMatch = entry.match(/Description:?\s*([\s\S]+)/i);

//             return {
//                 projectId: `proj_${i + 1}`,
//                 title: titleMatch ? titleMatch[1].trim() : '',
//                 techStack: techStackMatch ? techStackMatch[1].split(/,|\n/).map(s => s.trim()).filter(Boolean) : [],
//                 projectLiveURL: projectLiveURLMatch ? projectLiveURLMatch[1].trim() : '',
//                 description: descriptionMatch ? descriptionMatch[1].trim() : '',
//             };
//         });
//     }

//     // Experience extraction
//     const experienceSectionRegex = /Experience:?([\s\S]*?)(Education|Projects|Languages|$)/i;
//     const experienceSectionMatch = text.match(experienceSectionRegex);

//     let experience = [];
//     if (experienceSectionMatch) {
//         const expText = experienceSectionMatch[1].trim();
//         const expEntries = expText.split(/\n{2,}/);

//         experience = expEntries.map((entry, i) => {
//             const titleMatch = entry.match(/Title:?\s*(.*)/i);
//             const companyMatch = entry.match(/Company:?\s*(.*)/i);
//             const startDateMatch = entry.match(/Start Date:?\s*([\w\s/-]+)/i);
//             const endDateMatch = entry.match(/End Date:?\s*([\w\s/-]+)/i);
//             const locationMatch = entry.match(/Location:?\s*(.*)/i);
//             const descriptionMatch = entry.match(/Description:?\s*([\s\S]+)/i);

//             return {
//                 expId: i + 1,
//                 title: titleMatch ? titleMatch[1].trim() : '',
//                 companyName: companyMatch ? companyMatch[1].trim() : '',
//                 startDate: startDateMatch ? safeParseDate(startDateMatch[1]) : null,
//                 endDate: endDateMatch ? safeParseDate(endDateMatch[1]) : null,
//                 location: locationMatch ? locationMatch[1].trim() : '',
//                 description: descriptionMatch ? descriptionMatch[1].trim() : '',
//             };
//         });
//     }

//     // Education extraction
//     const educationSectionRegex = /Education:?([\s\S]*?)(Experience|Projects|Languages|$)/i;
//     const educationSectionMatch = text.match(educationSectionRegex);

//     let education = [];
//     if (educationSectionMatch) {
//         const eduText = educationSectionMatch[1].trim();
//         const eduEntries = eduText.split(/\n{2,}/);

//         education = eduEntries.map((entry, i) => {
//             const instituteMatch = entry.match(/Institute Name:?\s*(.*)/i);
//             const degreeMatch = entry.match(/Degree:?\s*(SSC|12th\/Intermediate|Bachelors|Masters)/i);
//             const fieldMatch = entry.match(/Field of Study:?\s*(.*)/i);
//             const startDateMatch = entry.match(/Start Date:?\s*([\w\s/-]+)/i);
//             const endDateMatch = entry.match(/End Date:?\s*([\w\s/-]+)/i);
//             const descriptionMatch = entry.match(/Description:?\s*([\s\S]+)/i);

//             return {
//                 eduId: i + 1,
//                 instituteName: instituteMatch ? instituteMatch[1].trim() : '',
//                 degree: degreeMatch ? degreeMatch[1] : '',
//                 fieldOfStudy: fieldMatch ? fieldMatch[1].trim() : '',
//                 startDate: startDateMatch ? safeParseDate(startDateMatch[1]) : null,
//                 endDate: endDateMatch ? safeParseDate(endDateMatch[1]) : null,
//                 description: descriptionMatch ? descriptionMatch[1].trim() : '',
//             };
//         });
//     }

//     // Language extraction
//     const languageSectionRegex = /Languages?:\s*((?:[\w\s]+(?:Fluent|Intermediate|Conversational|Native)?[,;\n\r]*)+)/i;
//     const languageSectionMatch = text.match(languageSectionRegex);

//     let language = [];
//     if (languageSectionMatch) {
//         const langStrings = languageSectionMatch[1].split(/,|;/);
//         language = langStrings.map((langStr, i) => {
//             const parts = langStr.trim().split(/\s+-\s+/);
//             return {
//                 langId: i + 1,
//                 langName: parts[0] || '',
//                 proficiency: parts[1] || '',
//             };
//         }).filter(l => l.langName);
//     }

//     // Final structured object
//     const parsedData = {
//         name: nameMatch ? nameMatch[1].trim() : '',
//         email: emailMatch ? emailMatch[1].toLowerCase() : '',
//         phone: phoneMatch ? phoneMatch[0].replace(/\D/g, '') : '',
//         country: countryMatch ? countryMatch[1].trim() : '',
//         linkedInURL: linkedInMatch ? linkedInMatch[0].trim() : '',
//         githubURL: githubMatch ? githubMatch[0].trim() : '',
//         portfolioURL: portfolioMatch ? portfolioMatch[0].trim() : '',
//         loginType,
//         categories: categoriesMatch ? categoriesMatch[1].split(/,|\n/).map(s => s.trim()).filter(Boolean) : [],
//         skills: skillsMatch ? skillsMatch[1].split(/,|\n/).map(s => s.trim()).filter(Boolean) : [],
//         title: titleMatch ? titleMatch[2].trim() : '',
//         projects,
//         experience,
//         education,
//         language,
//     };

//     return parsedData;
// }

// export default parseResumeText