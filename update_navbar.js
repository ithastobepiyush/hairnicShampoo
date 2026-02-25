const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\piyush\\Desktop\\Hairnic';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const authSnippet = `
                        <div class="nav-item d-none align-items-center" id="nav-user-info">
                            <span class="nav-link text-primary fw-bold" id="user-greeting">Welcome, User</span>
                            <a href="#" class="nav-item nav-link" onclick="logoutUser(event)">Logout</a>
                        </div>
                        <div class="nav-item d-flex align-items-center" id="nav-auth-buttons">
                            <a href="login.html" class="nav-item nav-link">Login</a>
                            <a href="register.html" class="nav-item nav-link">Register</a>
                        </div>
`;

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    if (content.includes('id="nav-auth-buttons"')) return;

    // Replace the specific block of "Buy Pro Version" and the end of navbar-nav
    // Or just find the closing </div> of navbar-nav.
    // The Buy Pro Version button is located outside the navbar-nav ms-auto div!
    // So navbar-nav ms-auto div closes, and then the button is there.
    // We want to insert our snippet BEFORE the navbar-nav ms-auto div closes.
    // That means we find:
    // "                    </div>\r\n                    <a href=\"https://htmlcodex.com/downloading/?item=2727\""
    // OR
    // "                    </div>\n                    <a href=\"https://htmlcodex.com/downloading/?item=2727\""
    // And we prepend the authSnippet before the first </div>.

    let pattern1 = /([ \t]*)<\/div>\r?\n[ \t]*<a href="https:\/\/htmlcodex\.com\/downloading\/\?item=2727"/;
    let pattern2 = /([ \t]*)<\/div>\r?\n[ \t]*<\/div>\r?\n[ \t]*<\/nav>/;

    if (pattern1.test(content)) {
        content = content.replace(pattern1, (match, spaces) => {
            return authSnippet + match;
        });
        fs.writeFileSync(path.join(dir, file), content);
        console.log("Updated", file);
    } else if (pattern2.test(content)) {
        content = content.replace(pattern2, (match, spaces) => {
            return authSnippet + match;
        });
        fs.writeFileSync(path.join(dir, file), content);
        console.log("Updated", file);
    } else {
        console.log("Could not find pattern in", file);
    }
});
console.log('done');
