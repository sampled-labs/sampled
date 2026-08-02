import { Button, Form, Input, Radio, Select } from "antd";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useNavigate } from "react-router-dom";
import { useWaitlistForm } from "../../hooks/useWaitlist";
import { IWaitlistFormData } from "../../@types/waitlist-form";
dayjs.extend(customParseFormat);

const primaryDAWOptions = [
  { value: "Ableton Live", label: "Ableton Live" },
  { value: "FL Studio", label: "FL Studio" },
  { value: "Logic Pro", label: "Logic Pro" },
  { value: "Pro Tools", label: "Pro Tools" },
  { value: "Studio One", label: "Studio One" },
  { value: "Cubase", label: "Cubase" },
  { value: "Other", label: "Other" },
];

const biggestStruggleOptions = [
  { value: "Mixing & Mastering", label: "Mixing & Mastering" },
  { value: "Sound Selection", label: "Sound Selection" },
  { value: "Music Theory", label: "Music Theory" },
  { value: "Arrangement", label: "Arrangement" },
  { value: "Finishing Tracks", label: "Finishing Tracks" },
  { value: "Other", label: "Other" },
];

export const PersonalDetails = () => {
  const {
    onUpdateState,
    data: { fields },
  } = useWaitlistForm();
  const navigate = useNavigate();
  const navigate_back = () => {
    void navigate("/");
  };
  return (
    <div className="md:max-w-[382px] mx-auto">
      <Form
        layout="vertical"
        initialValues={{ ...fields }}
        requiredMark={false}
        onFinish={(values: IWaitlistFormData["fields"]) => {
          onUpdateState({
            fields: {
              ...values,
            },
            step: 2,
          });

          // console.log("Finished", fields)
        }}
      >
        <Form.Item
          label="Name"
          name={"name"}
          rules={[{ required: true, min: 5 }]}
          validateDebounce={1000}
        >
          <Input className="h-[42px]" placeholder="Enter username" />
        </Form.Item>
        <Form.Item
          label="Email"
          name={"email"}
          rules={[{ required: true, type: "email" }]}
          validateDebounce={1000}
        >
          <Input className="h-[42px]" placeholder="Enter email" type="email" />
        </Form.Item>
        <Form.Item
          label="Alias/Stage name"
          name={"artistName"}
          rules={[{ required: false, min: 1 }]}
          validateDebounce={1000}
        >
          <Input className="h-[42px]" placeholder="Enter stage name" />
        </Form.Item>
        <Form.Item
          rules={[{ required: false }]}
          label={
            <div>
              <p>Biggest Struggle</p>
              <p className="text-xs text-grey-300">
                Your primary challenge in music production and consumption
              </p>
            </div>
          }
          validateDebounce={1000}
          name={"biggestStruggle"}
        >
          <Select
            className="h-[42px]!"
            placeholder="Select biggest struggle"
            options={biggestStruggleOptions}
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: false }]}
          label={
            <div>
              <p>Primary DAW</p>
              <p className="text-xs text-grey-300">
                The primary Digital Audio Workstation you use
              </p>
            </div>
          }
          validateDebounce={1000}
          name={"primaryDAW"}
        >
          <Select
            className="h-[42px]!"
            placeholder="Select primary DAW"
            options={primaryDAWOptions}
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          label={
            <div>
              <p>Gender</p>
              <p className="text-xs text-grey-300 md:max-w-[350px]">
                We use your gender to personalize content, recommendations and
                adds for you.
              </p>
            </div>
          }
          name={"gender"}
          validateDebounce={1000}
        >
          <Radio.Group className="justify-between !flex">
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="not-specified">Prefer not say</Radio>
          </Radio.Group>
        </Form.Item>

        <div className="mt-8 md:mt-8">
          <div className="flex justify-center gap-5 items-center">
            <Button
              type="default"
              className="!rounded-full md:!px-8 md:!w-[150px] !h-[40px] !w-[140px]"
              icon={<BsArrowLeft />}
              htmlType="button"
              onClick={navigate_back}
            >
              Prev
            </Button>{" "}
            <Button
              type="primary"
              className="!rounded-full md:!px-8 md:!w-[150px] !w-[140px] !h-[40px]"
              icon={<BsArrowRight />}
              iconPosition="end"
              htmlType="submit"
            >
              Next
            </Button>
          </div>

          <p className="text-xs text-grey-300 text-center mt-5">
            Privacy and Policy
          </p>
        </div>
      </Form>
    </div>
  );
};
