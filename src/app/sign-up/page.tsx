import { HTMLInputTypeAttribute, useState } from "react";

export default function SignUp() {
  return (
    <>
      <main className="flex flex-col items-center padding-24">
        <div>
          <SignUpForm />
        </div>
      </main>
    </>
  );
}

function submitForm(formData: FormData) {
  const password = formData.get("password"), verifyPassword = formData.get("verifyPassword")
  if (password === verifyPassword) {
    
  }
}

function SignUpForm() {
  return (
    <form action={submitForm}>
      <FormField fieldName={"name"} inputType={"text"} description={"Display name:"} />
      <FormField fieldName={"email"} inputType={"email"} description={"Email:"} />
      <PasswordField />
      <input type="submit"/>
    </form>
  )

  function PasswordField() {
    return (
      <>
        <div>
          <label>
            Password:
            <input name="password" type="password" />
          </label>
        </div>
        <div>
          <label>
            Verify password:
            <input name="verifyPassword" type="password" />
          </label>
        </div>
      </>
    );
  }
}

function FormField({fieldName, inputType, description}: { fieldName: string, inputType: HTMLInputTypeAttribute, description: string }) {
  return (
    <div>
      <label>
        {description}
        <input name={fieldName} type={inputType} />
      </label>
    </div>
  );
}

