import SchoolShell from "@/components/schools/school-shell"
import ApplyForm from "@/components/schools/apply-form"

export const metadata = { title: "Bring your school to HIF" }

export default function ApplyPage() {
  return (
    <SchoolShell
      title="Bring your school to HIF"
      intro="Classes, assigned passages, progress and sign-in slips for your pupils. The first term is a free pilot. HIF checks your registration before opening an account. The school stays in charge of its pupils’ data."
    >
      <ApplyForm />
    </SchoolShell>
  )
}
