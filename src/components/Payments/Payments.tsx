import {
  CardStyles,
  CompletionCompStyle,
  type ILoaderStyle,
  LoaderStyle,
  PaymentCompStyles,
  PaymentFormStyles,
  PaymentLinkStyles,
  PlanStyles,
  RadioBtnStyle,
  StepCompStyles,
  StepStyles,
} from "@/styles/PaymentsStyles/Payments"
import { AnimatePresence, motion } from "framer-motion"
import { useOutsideClickDiv } from "../CourseCard/OutsideClick"
import { type Dispatch, type FunctionComponent, type SetStateAction, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Router from "next/router"
import { useRouter } from "next/navigation"
import { ErrorStyles, FormLabelStyles, InputStyles } from "@/styles/ContactpageStyles/Contact"
import { DetailH3Styles, DetailSmallStyles, TutorHeadStyle } from "@/styles/CoursepageStyles/CourseDetail"
import { XtraSmall } from "@/styles/SectionHeadStyles/Small"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import type { RootState } from "@/redux/store"
import { convertToNaira } from "../Info/Wishlist"
import type { IButton } from "@/styles/ButtonStyles/ButtonGroup"
import { FormButton, PaymentButtonStyles } from "@/styles/HeroStyles/HeroSearch"
import { useForm } from "react-hook-form"
import { LoadingDone, Logo, Paypal, Tick, VisaCard } from "../Icons/Icons"
import { EachFormVariants } from "@/Animations/PaymentVariants"
import { PageLinkStyle } from "@/styles/LinkStyles/Link"
import { pushNotification, setShowPaymentModaL, setShowTryFreeModaL, setUserData } from "@/redux/dataSlice"
import type { IUser } from "@/Constant/constant"
import type { INotification } from "../Info/Notifications"
import { v4 as uuidv4 } from "uuid"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import CheckoutForm from "../CheckoutForm"


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export interface IPayment {
  isFreeTrial: boolean
}
export interface IPlan {
  name: string
  price: number | undefined
  isInstallmental?: boolean
  installmentsDuration?: number
  installmentalPrice?: number
  $isSelected: boolean
  priceId: string // Add this line
}
export const freeTrial: IPlan = {
  name: "Free",
  $isSelected: true,
  price: 0,
  isInstallmental: false,
  priceId: "",
}

export const Payment: FunctionComponent<IPayment> = ({ isFreeTrial }) => {
  const dispatch = useAppDispatch()
  const { showPaymentModal, showTryFreeModal } = useAppSelector((state: RootState) => state.data)
  const ref = useOutsideClickDiv(() => {
    showPaymentModal && dispatch(setShowPaymentModaL(false))
    showTryFreeModal && dispatch(setShowTryFreeModaL(false))
  })
  return (
    <PaymentCompStyles>
      <div className="formref" ref={ref}>
        <PaymentForm />
      </div>
    </PaymentCompStyles>
  )
}

interface IFormA {
  name: string
  email: string
  plan: IPlan
}
interface IFormB {
  name: string
  cardnumber: string
  date: string
  cvv: string
  card: ICard
}
export const PaymentForm: FunctionComponent = ({}) => {
  const { course, user, showTryFreeModal, showPaymentModal } = useAppSelector((state: RootState) => state.data)
  const plans: IPlan[] = [
    {
      name: "Full",
      $isSelected: true,
      price: course?.dollarPrice,
      isInstallmental: false,
      priceId: "price_1234567890", // Replace with your actual Stripe Price ID
    },
  ]
  const [plansState, setPlansState] = useState(plans)

  const [steps, setSteps] = useState<ISteps>({
    step: 1,
    completedPrevious: false,
  })
  const [cards, setCards] = useState<ICard[]>([
    { name: "Visa", isSelected: true },
    { name: "Paypal", isSelected: false },
  ])

  // for form 1
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormA>({
    mode: "onBlur",
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
        }
      : {
          name: "",
          email: "",
        },
  })
  // for form 2
  const {
    register: registerB,
    reset: resetB,
    handleSubmit: handleSubmitB,
    formState: { errors: errorsB },
  } = useForm<IFormB>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      date: "",
      cardnumber: "",
      cvv: "",
    },
  })
  const [plan, setPlan] = useState<IPlan>()
  const dispatch = useAppDispatch()

  const next = (data: IFormA) => {
    const selectedPlan = plansState.find((ele) => ele.$isSelected === true)
    if (selectedPlan) {
      setPlan(selectedPlan)
      data.plan = selectedPlan
    }
    //console.log(data); //send to redux for now
    let realUser: IUser | null = null
    if (user === null) {
      realUser = {
        name: data.name,
        email: data.email,
        enrolledCourses: null,
      }
    } else {
      realUser = user
    }
    dispatch(setUserData(realUser))
    setSteps({ step: 2, completedPrevious: true })
    reset()
  }

  // for free
  const tryFree = (data: IFormA) => {
    const selectedPlan = freeTrial
    let realUser: IUser | null = null
    if (user === null) {
      realUser = {
        name: data.name,
        email: data.email,
        enrolledCourses: null,
      }
    } else {
      realUser = user
    }
    if (showTryFreeModal && course && course.id !== null && realUser) {
      const completeUser: IUser =
        realUser.enrolledCourses !== null
          ? {
              ...realUser,
              enrolledCourses: [
                ...realUser.enrolledCourses,
                {
                  courseId: course.id,
                  plan: selectedPlan,
                  isPaid: false,
                  isFree: true,
                },
              ],
            }
          : {
              ...realUser,
              enrolledCourses: [
                {
                  courseId: course.id,
                  plan: selectedPlan,
                  isPaid: false,
                  isFree: true,
                },
              ],
            }
      dispatch(setUserData(completeUser))
      // skip to the last form state
      setSteps({ step: 3, completedPrevious: true })
      // notification
      const id: string = uuidv4()
      if (showTryFreeModal) {
        const notification: INotification = {
          type: "payment",
          message: `Welcome to ${course.name}, you were successfully enrolled in the 1 week trial!`,
          id: id,
        }
        dispatch(pushNotification(notification))
      }
    }
  }

  // console.log(filteredEnrolledCourse)
  const submit = async (data: IFormB) => {
    // The actual payment processing is now handled in the CheckoutForm component
    // This function can be used for any additional logic or state updates
    if (user && course && course.id !== null && plan) {
      let completeUser: IUser | null = null
      if (user.enrolledCourses === null) {
        completeUser = {
          ...user,
          enrolledCourses: [
            {
              courseId: course.id,
              plan: plan,
              isPaid: true,
              isFree: false,
            },
          ],
        }
      } else {
        const existingCourse = user?.enrolledCourses?.find((ele) => ele.courseId === course?.id)
        const filteredEnrolledCourse = user?.enrolledCourses?.filter((ele) => ele.courseId !== existingCourse?.courseId)
        if (existingCourse) {
          completeUser = {
            ...user,
            enrolledCourses: [
              ...filteredEnrolledCourse,
              {
                courseId: course.id,
                plan: plan,
                isPaid: true,
                isFree: false,
              },
            ],
          }
        } else {
          completeUser = {
            ...user,
            enrolledCourses: [
              ...user.enrolledCourses,
              {
                courseId: course.id,
                plan: plan,
                isPaid: true,
                isFree: false,
              },
            ],
          }
        }
      }
      dispatch(setUserData(completeUser))
    }
    // console.log(data); -> send to backend for payment
    resetB()
    setSteps({ step: 3, completedPrevious: true })
    // create notif
    const id: string = uuidv4()
    if (showPaymentModal) {
      const notification: INotification = {
        type: "payment",
        message: `Welcome to ${course?.name}, you were successfully enrolled!`,
        id: id,
      }
      dispatch(pushNotification(notification))
    }
  }
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormStyles>
        {steps.step !== 3 && (
          <>
            <StepComp step={steps.step} completedPrevious={steps.completedPrevious} />
            <AnimatePresence mode="wait">
              {/* form step 1 when not free payment */}
              {steps.step === 1 && !showTryFreeModal && (
                <motion.form
                  onSubmit={handleSubmit(next)}
                  variants={EachFormVariants}
                  initial="initial"
                  animate="final"
                  exit="exit"
                  key="hinokami"
                >
                  <div className="form-ele">
                    <p className="section-name">Personal Details</p>
                    <div className="section">
                      <FormLabelStyles>
                        <label htmlFor="name">Full Name</label>
                      </FormLabelStyles>
                      <div className="input">
                        <InputStyles>
                          <input
                            type="text"
                            id=""
                            placeholder="John Doe"
                            {...register("name", {
                              required: "Name is required",
                            })}
                          />
                        </InputStyles>
                        <ErrorStyles>{errors?.name && errors.name.message}</ErrorStyles>
                      </div>
                    </div>
                    <div className="section">
                      <FormLabelStyles>
                        <label htmlFor="email">Email</label>
                      </FormLabelStyles>
                      <div className="input">
                        <InputStyles>
                          <input
                            type="email"
                            id=""
                            placeholder="JohnDoe@gmail.com"
                            {...register("email", {
                              required: "Email is required",
                            })}
                          />
                        </InputStyles>
                        <ErrorStyles>{errors?.email && errors.email.message}</ErrorStyles>
                      </div>
                    </div>
                  </div>
                  <div className="form-ele">
                    <p className="section-name">Course Details</p>
                    <div className="section">
                      <div className="course">
                        <DetailSmallStyles color="var(--grey-500, #525252)">Course</DetailSmallStyles>
                        <DetailSmallStyles color="var(--grey-500, #525252)" fontWeight={700}>
                          {course?.name}
                        </DetailSmallStyles>
                      </div>
                      <div className="select-plan">
                        <p className="section-name">Payment Plan</p>
                        <div className="plans">
                          {plansState.map((ele, index) => (
                            <Plan
                              key={index}
                              name={ele.name}
                              price={ele.price}
                              $isSelected={ele.$isSelected}
                              priceId={ele.priceId}
                              isInstallmental={ele.isInstallmental}
                              installmentalPrice={ele.installmentalPrice}
                              installmentsDuration={ele.installmentsDuration}
                              plansState={plansState}
                              setPlansState={setPlansState}                             />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-ele">
                    <PaymentButtonStyles>Proceed</PaymentButtonStyles>
                  </div>
                </motion.form>
              )}
              {/* form step 1 when  free payment */}
              {steps.step === 1 && showTryFreeModal && (
                <motion.form
                  onSubmit={handleSubmit(tryFree)}
                  variants={EachFormVariants}
                  initial="initial"
                  animate="final"
                  exit="exit"
                  key="hinokami"
                >
                  <div className="form-ele">
                    <p className="section-name">Personal Details</p>
                    <div className="section">
                      <FormLabelStyles>
                        <label htmlFor="name">Full Name</label>
                      </FormLabelStyles>
                      <div className="input">
                        <InputStyles>
                          <input
                            type="text"
                            id=""
                            placeholder="John Doe"
                            {...register("name", {
                              required: "Name is required",
                            })}
                          />
                        </InputStyles>
                        <ErrorStyles>{errors?.name && errors.name.message}</ErrorStyles>
                      </div>
                    </div>
                    <div className="section">
                      <FormLabelStyles>
                        <label htmlFor="email">Email</label>
                      </FormLabelStyles>
                      <div className="input">
                        <InputStyles>
                          <input
                            type="email"
                            id=""
                            placeholder="JohnDoe@gmail.com"
                            {...register("email", {
                              required: "Email is required",
                            })}
                          />
                        </InputStyles>
                        <ErrorStyles>{errors?.email && errors.email.message}</ErrorStyles>
                      </div>
                    </div>
                  </div>
                  <div className="form-ele">
                    <p className="section-name">Course Details</p>
                    <div className="section">
                      <div className="course">
                        <DetailSmallStyles color="var(--grey-500, #525252)">Course</DetailSmallStyles>
                        <DetailSmallStyles color="var(--grey-500, #525252)" fontWeight={700}>
                          {course?.name}
                        </DetailSmallStyles>
                      </div>
                      <div className="select-plan">
                        <p className="section-name">Payment Plan</p>
                        <div className="plans">
                          <Plan
                            name={freeTrial.name}
                            price={freeTrial.price}
                            priceId={freeTrial.priceId}
                            $isSelected={freeTrial.$isSelected}
                            isInstallmental={freeTrial.isInstallmental}
                            installmentalPrice={freeTrial.installmentalPrice}
                            installmentsDuration={freeTrial.installmentsDuration}
                            plansState={plansState}
                            setPlansState={setPlansState}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-ele">
                    <PaymentButtonStyles>Start Demo</PaymentButtonStyles>
                  </div>
                </motion.form>
              )}
              {/* form step 2 should show when free payment */}
              {steps.step === 2 && !showTryFreeModal && (
                <motion.div
                  className="form-2"
                  variants={EachFormVariants}
                  initial="initial"
                  animate="final"
                  key="kagura"
                  exit="exit"
                >
                  <div className="form-ele">
                    <p className="section-name">Payment Method</p>
                    <div className="section">
                      <CheckoutForm />
                    </div>
                  </div>
                  {/* Keep the amount display section */}
                  <div className="form-ele xxx">
                    <div className="section">
                      <div className="amount">
                        <DetailSmallStyles color="var(--grey-500, #525252)">Amount</DetailSmallStyles>
                        <div className="c">
                          {plan?.isInstallmental && plan.installmentalPrice && (
                            <>
                              <h4>
                                &#8358;
                                {convertToNaira(plan.installmentalPrice).toLocaleString()}
                                /month
                              </h4>
                              <div className="section-name">{/* approx ${plan.installmentalPrice}/month */}</div>
                            </>
                          )}
                          {/* not installmental payment */}
                          {!plan?.isInstallmental && plan?.price && (
                            <>
                              <h4>
                                &#8358;
                                {convertToNaira(plan.price).toLocaleString()}
                              </h4>
                              {/* <div className="section-name">
                              approx ${plan.price}
                            </div> */}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-ele">
                    <PaymentButtonStyles>Make Payment</PaymentButtonStyles>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
        {/* form step 3 when not free payment */}
        {steps.step === 3 && course && !showTryFreeModal && (
          <CompletionComp
            loadingMessage="Payment Loading..."
            successMessage="Payment Successful"
            courseName={course.name}
          />
        )}
        {/* form step 1 when  free payment */}
        {showTryFreeModal && steps.step === 3 && course && (
          <CompletionComp
            loadingMessage="Demo Registeration Loading..."
            successMessage="Demo Registration Successful"
            courseName={course.name}
          />
        )}
      </PaymentFormStyles>
    </Elements>
  )
}

interface IPlanFC extends IPlan {
  plansState: IPlan[]
  setPlansState: Dispatch<SetStateAction<IPlan[]>>
}

export const Plan: FunctionComponent<IPlanFC> = ({
  name,
  price,
  isInstallmental,
  $isSelected,
  installmentalPrice,
  installmentsDuration,
  plansState,
  setPlansState,
}) => {
  const { showTryFreeModal } = useAppSelector((state: RootState) => state.data)
  const handleClick = () => {
    const newPlansState = plansState.map((ele) => {
      if (ele.name === name) {
        return { ...ele, $isSelected: true }
      } else {
        return { ...ele, $isSelected: false }
      }
    })
    setPlansState(newPlansState)
    showTryFreeModal && setPlansState([freeTrial])
  }
  return (
    <PlanStyles $isChecked={$isSelected} onClick={handleClick}>
      <div className="a">
        <RadioBtn $isChecked={$isSelected} />
        <div className="inner">
          <DetailSmallStyles color="var(--grey-700, #272727)">{name}</DetailSmallStyles>
          {installmentsDuration && <XtraSmall>{installmentsDuration} months</XtraSmall>}
        </div>
      </div>
      <div className="b">
        <div className="inner">
          {isInstallmental && installmentalPrice ? (
            <DetailSmallStyles color="var(--grey-500, #525252)" fontWeight={700}>
              &#8358; {convertToNaira(installmentalPrice).toLocaleString()}
              /month
            </DetailSmallStyles>
          ) : (
            <></>
          )}
          {!isInstallmental && price ? (
            <DetailSmallStyles color="var(--grey-500, #525252)" fontWeight={700}>
              &#8358; {convertToNaira(price).toLocaleString()}
            </DetailSmallStyles>
          ) : (
            <></>
          )}
          {!isInstallmental && showTryFreeModal && (
            <DetailSmallStyles color="var(--grey-500, #525252)" fontWeight={700}>
              &#8358; 0
            </DetailSmallStyles>
          )}
          {isInstallmental && installmentalPrice && <XtraSmall>approx ${installmentalPrice}/month</XtraSmall>}
          {!isInstallmental && <XtraSmall> $45</XtraSmall>}
        </div>
      </div>
    </PlanStyles>
  )
}

export interface IRadioBtn extends IButton {
  $isChecked: boolean
}
export interface IRadioBtnStyleProp {
  $isChecked: boolean
}
export const RadioBtn: FunctionComponent<IRadioBtnStyleProp> = ({ $isChecked }) => {
  return (
    <RadioBtnStyle $isChecked={$isChecked}>
      <span></span>
    </RadioBtnStyle>
  )
}

export interface ICard {
  name: string
  isSelected: boolean
}

export interface ICardFC extends ICard {
  cards: ICard[]
  setCards: Dispatch<SetStateAction<ICard[]>>
}

export const Card: FunctionComponent<ICardFC> = ({ name, isSelected, cards, setCards }) => {
  const selectCard = () => {
    const newCards = cards.map((ele) => {
      if (ele.name === name) {
        return { ...ele, isSelected: true }
      } else {
        return { ...ele, isSelected: false }
      }
    })
    setCards(newCards)
  }
  return (
    <CardStyles $isSelected={isSelected}>
      <RadioBtnStyle $isChecked={isSelected} onClick={selectCard}>
        <span></span>
      </RadioBtnStyle>
      <div className="fl" onClick={selectCard}>
        {name.toLowerCase() == "visa" && <VisaCard />}
        {name.toLowerCase() == "paypal" && <Paypal />}
        <p>{name}</p>
      </div>
    </CardStyles>
  )
}

// form steps count
export interface ISteps {
  step: number
  completedPrevious: boolean
}

interface IStepObj {
  name: string
  step: number
}
export const StepComp: FunctionComponent<ISteps> = ({ step, completedPrevious }) => {
  const [stepObjs, setStepObjs] = useState<IStepObj[]>([
    { step: 1, name: "Checkout" },
    { step: 2, name: "Payment" },
  ])
  return (
    <StepCompStyles $isSelected={step === 2}>
      {stepObjs.map((ele, index) => (
        <StepStyles key={index} $isSelected={ele.step === step} $isDoneWithOne={completedPrevious && ele.step === 1}>
          <div className="circle">{completedPrevious && ele.step === 1 ? <Tick /> : ele.step}</div>
          <FormLabelStyles color="var(--grey-700, #272727)">{ele.name}</FormLabelStyles>
        </StepStyles>
      ))}
      <div className="line"></div>
    </StepCompStyles>
  )
}

export const Loader: FunctionComponent<ILoaderStyle> = ({ size }) => {
  return (
    <LoaderStyle size={size}>
      <div className="loader"></div>
    </LoaderStyle>
  )
}

interface ICompletion {
  loadingMessage: string
  successMessage: string
  courseName: string
}
export const CompletionComp: FunctionComponent<ICompletion> = ({ loadingMessage, successMessage, courseName }) => {
  const [isLoadingDone, setIsLoadingDone] = useState(false)
  // timer for loader
  setTimeout(() => {
    setIsLoadingDone(true)
  }, 2000)
  const dispatch = useAppDispatch()
  const { showPaymentModal, showTryFreeModal } = useAppSelector((state: RootState) => state.data)
  // notification : come back to this
  // useEffect(()=>{
  //   const id: string = uuidv4();
  //   let notification: INotification;
  //   if (showPaymentModal) {
  //     notification = {
  //       type: "payment",
  //       message: `Welcome to ${courseName}, your were successfully enrolled!`,
  //       id: id,
  //     };
  //     dispatch(pushNotification(notification));
  //   }
  //   if (showTryFreeModal) {
  //     notification = {
  //       type: "payment",
  //       message: `Welcome to ${courseName}, your were successfully enrolled in the 1 week trial!`,
  //       id: id,
  //     };
  //     dispatch(pushNotification(notification));
  //   }
  // }, [showPaymentModal, showTryFreeModal,courseName,dispatch])
  // reload the course detail page -> Apparently, since I am not using an API, reloading will reset the reduce state
  // const router = useRouter();
  const reloadPage = () => {
    // router.refresh();
    showPaymentModal && dispatch(setShowPaymentModaL(false))
    showTryFreeModal && dispatch(setShowTryFreeModaL(false))
  }
  return (
    <CompletionCompStyle>
      <div className="logo">
        <Logo />
      </div>
      <AnimatePresence mode="wait">
        {!isLoadingDone && (
          <motion.div
            className="loading"
            variants={EachFormVariants}
            initial="initial"
            animate="final"
            exit="exit"
            key="hinokami"
          >
            <Loader />
            <DetailH3Styles>{loadingMessage}</DetailH3Styles>
          </motion.div>
        )}
        {isLoadingDone && (
          <motion.div
            className="success"
            variants={EachFormVariants}
            initial="initial"
            animate="final"
            exit="exit"
            key="tanjiro"
          >
            <div className="one">
              <LoadingDone />
              <DetailH3Styles>{successMessage}</DetailH3Styles>
            </div>
            <div className="two">
              <DetailSmallStyles>
                You have successfully registered for James Cryptoguru trading {courseName}
                {showTryFreeModal && " 1 week Demo class"}
                <br />
                You will receive an email shortly, containing all the necessary information to begin your classes.
              </DetailSmallStyles>

              <PaymentLinkStyles onClick={reloadPage}>Welcome Onboard</PaymentLinkStyles>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CompletionCompStyle>
  )
}

