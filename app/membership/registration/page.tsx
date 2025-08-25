import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: "Membership Registration | Hamduk Islamic Foundation",
  description: "Register to become a member of Hamduk Islamic Foundation",
}

export default function RegistrationPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-900 dark:text-emerald-500 mb-4">
          Membership Registration
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Complete the form below to register as a member of the Hamduk Islamic Foundation.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
            <CardTitle className="text-2xl text-emerald-900 dark:text-emerald-500">Registration Form</CardTitle>
            <CardDescription>Please fill out all required fields marked with an asterisk (*)</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-800 dark:text-emerald-400">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="Enter your first name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Enter your last name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="Enter your email address" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" placeholder="Enter your phone number" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input id="dob" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <RadioGroup defaultValue="male" className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-800 dark:text-emerald-400">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input id="address" placeholder="Enter your street address" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City/Town *</Label>
                    <Input id="city" placeholder="Enter your city or town" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="abia">Abia</SelectItem>
                        <SelectItem value="adamawa">Adamawa</SelectItem>
                        <SelectItem value="akwa-ibom">Akwa Ibom</SelectItem>
                        <SelectItem value="anambra">Anambra</SelectItem>
                        <SelectItem value="bauchi">Bauchi</SelectItem>
                        <SelectItem value="bayelsa">Bayelsa</SelectItem>
                        <SelectItem value="benue">Benue</SelectItem>
                        <SelectItem value="borno">Borno</SelectItem>
                        <SelectItem value="cross-river">Cross River</SelectItem>
                        <SelectItem value="delta">Delta</SelectItem>
                        <SelectItem value="ebonyi">Ebonyi</SelectItem>
                        <SelectItem value="edo">Edo</SelectItem>
                        <SelectItem value="ekiti">Ekiti</SelectItem>
                        <SelectItem value="enugu">Enugu</SelectItem>
                        <SelectItem value="fct">Federal Capital Territory</SelectItem>
                        <SelectItem value="gombe">Gombe</SelectItem>
                        <SelectItem value="imo">Imo</SelectItem>
                        <SelectItem value="jigawa">Jigawa</SelectItem>
                        <SelectItem value="kaduna">Kaduna</SelectItem>
                        <SelectItem value="kano">Kano</SelectItem>
                        <SelectItem value="katsina">Katsina</SelectItem>
                        <SelectItem value="kebbi">Kebbi</SelectItem>
                        <SelectItem value="kogi">Kogi</SelectItem>
                        <SelectItem value="kwara">Kwara</SelectItem>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="nasarawa">Nasarawa</SelectItem>
                        <SelectItem value="niger">Niger</SelectItem>
                        <SelectItem value="ogun">Ogun</SelectItem>
                        <SelectItem value="ondo">Ondo</SelectItem>
                        <SelectItem value="osun">Osun</SelectItem>
                        <SelectItem value="oyo">Oyo</SelectItem>
                        <SelectItem value="plateau">Plateau</SelectItem>
                        <SelectItem value="rivers">Rivers</SelectItem>
                        <SelectItem value="sokoto">Sokoto</SelectItem>
                        <SelectItem value="taraba">Taraba</SelectItem>
                        <SelectItem value="yobe">Yobe</SelectItem>
                        <SelectItem value="zamfara">Zamfara</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal">Postal Code</Label>
                    <Input id="postal" placeholder="Enter your postal code" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select defaultValue="nigeria">
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nigeria">Nigeria</SelectItem>
                        <SelectItem value="ghana">Ghana</SelectItem>
                        <SelectItem value="cameroon">Cameroon</SelectItem>
                        <SelectItem value="benin">Benin</SelectItem>
                        <SelectItem value="niger">Niger</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Membership Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-800 dark:text-emerald-400">
                  Membership Information
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="membershipType">Membership Type *</Label>
                    <RadioGroup defaultValue="regular" className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="regular" id="regular" className="mt-1" />
                        <div>
                          <Label htmlFor="regular" className="font-medium">
                            Regular Membership
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            For adult Muslims (18+ years) who accept the foundation's principles and objectives.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="associate" id="associate" className="mt-1" />
                        <div>
                          <Label htmlFor="associate" className="font-medium">
                            Associate Membership
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            For non-Muslims who support the foundation's objectives.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="youth" id="youth" className="mt-1" />
                        <div>
                          <Label htmlFor="youth" className="font-medium">
                            Youth Membership
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            For young Muslims between 13-17 years (requires parental consent).
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch">Preferred Branch *</Label>
                    <Select>
                      <SelectTrigger id="branch">
                        <SelectValue placeholder="Select your preferred branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lagos">Lagos Branch</SelectItem>
                        <SelectItem value="abuja">Abuja Branch</SelectItem>
                        <SelectItem value="kano">Kano Branch</SelectItem>
                        <SelectItem value="kaduna">Kaduna Branch</SelectItem>
                        <SelectItem value="ibadan">Ibadan Branch</SelectItem>
                        <SelectItem value="port-harcourt">Port Harcourt Branch</SelectItem>
                        <SelectItem value="maiduguri">Maiduguri Branch</SelectItem>
                        <SelectItem value="sokoto">Sokoto Branch</SelectItem>
                        <SelectItem value="enugu">Enugu Branch</SelectItem>
                        <SelectItem value="none">No preference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests">Areas of Interest (Select all that apply)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="education" />
                        <Label htmlFor="education">Islamic Education</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="youth" />
                        <Label htmlFor="youth">Youth Programs</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dawah" />
                        <Label htmlFor="dawah">Da'wah Activities</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="charity" />
                        <Label htmlFor="charity">Charity & Humanitarian Work</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="community" />
                        <Label htmlFor="community">Community Development</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="advocacy" />
                        <Label htmlFor="advocacy">Advocacy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="media" />
                        <Label htmlFor="media">Media & Publications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="events" />
                        <Label htmlFor="events">Events & Programs</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills & Expertise (How can you contribute?)</Label>
                    <Textarea
                      id="skills"
                      placeholder="Please share any skills, expertise, or experience that you could contribute to the foundation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referral">How did you hear about us?</Label>
                    <Select>
                      <SelectTrigger id="referral">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friend">Friend or Family</SelectItem>
                        <SelectItem value="event">Foundation Event</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="mosque">Local Mosque</SelectItem>
                        <SelectItem value="newspaper">Newspaper/Magazine</SelectItem>
                        <SelectItem value="radio">Radio/TV</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" className="mt-1" required />
                  <div>
                    <Label htmlFor="terms" className="font-medium">
                      Terms and Conditions *
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      I agree to abide by the constitution, bylaws, and code of conduct of the Hamduk Islamic
                      Foundation. I confirm that all information provided is accurate and complete.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="communications" className="mt-1" />
                  <div>
                    <Label htmlFor="communications" className="font-medium">
                      Communications
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      I consent to receive communications from the Hamduk Islamic Foundation, including newsletters,
                      event invitations, and updates via email, SMS, or other channels.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Submit Registration
                </Button>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  After submitting your registration, you will receive an email with instructions for completing your
                  membership process, including payment of membership dues.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
