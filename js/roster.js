// this code pulls roster data from a publicly available Google Sheet and creates the HTML elements that show the players
// if this ever breaks please contact Olympia Walker :))

// if this sheets URL ever needs to be changed:
// - the '1KnLGrVir50pfK0daIzOkmpXcujDeeScteh_HlgGta0o' bit is the sheet ID (same as the long thing in the URL if you were looking at it in a browser)
// - the 'A3%3AE` is a URL encoded version of 'A3:E' which refers to the spreadsheet range of the values
// - the key refers to the Google Sheet API key owned by the Ultimate email's Google Cloud Developer account
//     - this is not a security risk because the API key can only read publicly shared Sheets :)

const fetchPlayersFromSpreadsheet = async () => {
    const data = await $.getJSON('https://sheets.googleapis.com/v4/spreadsheets/1KnLGrVir50pfK0daIzOkmpXcujDeeScteh_HlgGta0o/values/A4%3AE?key=AIzaSyBm71eEjdCOSHPdwhlGQEZmlqWV254f6sg');
    return data.values; // returns an array of arrays (array of rows where each row is an array of cells)
}

const fetchCoachesFromSpreadsheet = async () => {
    const data = await $.getJSON('https://sheets.googleapis.com/v4/spreadsheets/1KnLGrVir50pfK0daIzOkmpXcujDeeScteh_HlgGta0o/values/G4%3AI?key=AIzaSyBm71eEjdCOSHPdwhlGQEZmlqWV254f6sg');
    return data.values
}

// creates two images, one for the baby pic and one for the college pic
// if one of the images isn't available (the URL is empty), then it falls back to the other one
// if both images are available, creates the hover effect that shows the college pic under the baby pic
const createPlayerPictures = (babyPicUrl, olderPicUrl, name) => {
    // create the baby pic
    const img = document.createElement('img');
    img.className = 'img-responsive img-circle';
    img.alt = name;
    img.src =  babyPicUrl || olderPicUrl // falls back to older pic if baby pic not provided
    const images = [img]
    // if both images are provided, create the hover effect
    if (babyPicUrl && olderPicUrl){
        // lets us put another image below this one
        img.style.cssText = "position: absolute; top: 0; left: 0; right: 0;"
        // adds hover behavior
        img.addEventListener('mouseover', () => { img.style.opacity = 0})
        img.addEventListener('mouseout', () => { img.style.opacity = 1})

        // add the college picture underneath
        const img2 = document.createElement('img');
        img2.className = 'img-responsive img-circle';
        img2.alt = name;
        img2.src = olderPicUrl
        images.push(img2)
    }
    return images
}

window.onload = async () => {
    const container = document.getElementById('roster').children[1];
    let row;

    // create a new row every three players
    const players = await fetchPlayersFromSpreadsheet();
    players.forEach(([name, number, year, babyPicUrl, olderPicUrl], index) => {
        if (index % 3 == 0){
            row = document.createElement('div');
            row.className = 'row';
            container.appendChild(row)
        }
        const column = document.createElement('div');
        column.className = 'col-sm-4';
        row.appendChild(column);

        const member = document.createElement('div');
        member.className = 'team-member';
        column.appendChild(member);

        createPlayerPictures(babyPicUrl, olderPicUrl, name).forEach(img => {
            member.appendChild(img)
        });

        const text = document.createElement('h4');
        text.innerHTML = `${name} #${number}<br><i>${year}</i></br>`
        member.appendChild(text)
    })

    // very similar for coaches
    const coaches = await fetchCoachesFromSpreadsheet();
    coaches.forEach(([name, babyPicUrl, olderPicUrl], index) => {
        if (index % 3 == 0){
            row = document.createElement('div');
            row.className = 'row';
            container.appendChild(row)
        }
        const column = document.createElement('div');
        column.className = 'col-sm-4';
        row.appendChild(column);

        const member = document.createElement('div');
        member.className = 'team-member';
        column.appendChild(member);

        createPlayerPictures(babyPicUrl, olderPicUrl, name).forEach(img => {
            member.appendChild(img)
        });

        const text = document.createElement('h4');
        text.innerHTML = `${name}<br><i>coach</i></br>`
        member.appendChild(text)
    })
}
