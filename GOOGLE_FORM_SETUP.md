# Google Form Setup for Contact Form

## 🚀 **Super Simple Setup (5 minutes)**

### **Step 1: Create Google Form**
1. Go to [forms.google.com](https://forms.google.com)
2. Click "Create a new form"
3. Add these fields:
   - **Name** (Short answer)
   - **Email** (Short answer) 
   - **Message** (Paragraph)

### **Step 2: Get Form Details**
1. Click "Send" button
2. Copy the form URL (looks like: `https://docs.google.com/forms/d/e/1FAIpQLSd.../viewform`)
3. **Important**: Change `/viewform` to `/formResponse` in the URL

### **Step 3: Get Field IDs**
1. Right-click on your form and "View page source"
2. Search for `entry.` - you'll see numbers like `entry.1234567890`
3. Note the numbers for each field:
   - Name field: `entry.XXXXX`
   - Email field: `entry.YYYYY` 
   - Message field: `entry.ZZZZZ`

### **Step 4: Update Your Code**
Replace these placeholders in `src/mixins/scenes/_4.pug`:

```pug
form(action="https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse" method="POST" target="hidden_iframe" onsubmit="setTimeout(function(){document.getElementById('contact-form-success').style.display='block';}, 1000)")
    input#contact-name(name="entry.1234567890" type="text" ...)  ← Replace 1234567890
    input#contact-email(name="entry.0987654321" type="email" ...) ← Replace 0987654321  
    textarea#contact-message(name="entry.1122334455" ...) ← Replace 1122334455
```

### **Step 5: View Responses**
- Responses automatically go to a Google Sheet
- Click "Responses" tab in your form
- Click the green Google Sheets icon to create a spreadsheet

## ✅ **Benefits**
- **No server needed** - form submits directly to Google
- **Automatic spreadsheet** - all contacts saved automatically
- **Free forever** - Google Forms is completely free
- **Mobile friendly** - works on all devices
- **No maintenance** - Google handles everything

## 🔧 **Alternative: Use Typeform**
If you want something fancier, [Typeform](https://typeform.com) has a free tier and looks more professional. 