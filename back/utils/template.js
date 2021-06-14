const Template = data => {

    const { from, to, subject, text } = data

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>  ${subject}  </title>
    
        <style>
            .container {
                padding: 2rem;
                font-size: 1.1rem;
                width: 80%;
                margin: 1rem auto;
            }
            .content {
                margin: 1rem 0;
                line-height: 1.5rem;
            }
            span.bold { font-weight: bold }
            span.italic { font-style: italic }
            div.greeting { margin-bottom: 1rem }
            footer { font-size: 1rem }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="greeting">  Hey <span class="bold"> ${to} </span>! </div>
    
            <div class="content">
                ${text}
            </div>
    
            <footer>
                Thanks,
                <span class="italic"> ${from} </span>
            </footer>
        </div>
        
    </body>
    </html>
      `;
  };
  
  module.exports = { Template }
  