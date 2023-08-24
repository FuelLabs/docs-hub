import { cssObj } from '@fuel-ui/css';
import {
  Form,
  Input,
  Icon,
  Button,
  Box,
  Text,
  Link,
  Alert,
} from '@fuel-ui/react';
import type { FormEvent } from 'react';
import { useState } from 'react';

interface FormData {
  helpful: boolean | null;
  feedback?: string;
  email?: string;
}

type Status = 'success' | 'error' | null;
type AlertMsg = string | null;

export function FeedbackForm() {
  const [formData, setFormData] = useState<FormData>({ helpful: null });
  const [status, setStatus] = useState<Status>(null);
  const [alertMsg, setAlertMsg] = useState<AlertMsg>(null);
  const [last, setLast] = useState<{ status: Status; alert: AlertMsg }>();

  const triggerAlert = (type: 'success' | 'error', msg: string) => {
    setStatus(type);
    setAlertMsg(msg);
    setLast({ status: type, alert: msg });
    setTimeout(() => {
      setStatus(null);
      setAlertMsg(null);
    }, 3500);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await fetch('/api/airtable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        triggerAlert('success', 'Sent! We appreciate your feedback.');
      } else {
        triggerAlert('error', 'Oops! Something went wrong.');
      }
    } catch (error) {
      triggerAlert('error', JSON.stringify(error));
    }
  };

  return (
    <Box css={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <Form.Control css={styles.formControl} isRequired>
          <h4>Was this page helpful?</h4>
          <Box.Flex gap={'8px'}>
            <input
              type="radio"
              id="trueButton"
              name="trueFalse"
              value="true"
              checked={formData.helpful === true}
              onChange={() => setFormData({ ...formData, helpful: true })}
              style={styles.radioButton}
            />
            <label
              style={
                formData.helpful === true
                  ? {
                      ...styles.buttonLabel,
                      ...styles.helpful,
                    }
                  : styles.buttonLabel
              }
              htmlFor="trueButton"
            >
              <Icon icon="ThumbUp" />
            </label>

            <input
              type="radio"
              id="falseButton"
              name="trueFalse"
              value="false"
              checked={formData.helpful === false}
              onChange={() => setFormData({ ...formData, helpful: false })}
              style={styles.radioButton}
            />
            <label
              style={
                formData.helpful === false
                  ? {
                      ...styles.buttonLabel,
                      ...styles.notHelpful,
                    }
                  : styles.buttonLabel
              }
              htmlFor="falseButton"
            >
              <Icon icon="ThumbDown" />
            </label>
          </Box.Flex>
        </Form.Control>

        {formData.helpful !== null && (
          <>
            {formData.helpful === false && (
              <Form.HelperText css={styles.forum}>
                If you need support, please create a post in our{' '}
                <Link isExternal href="https://forum.fuel.network/">
                  Forum
                </Link>
                .
              </Form.HelperText>
            )}

            <Form.Control css={styles.formControl}>
              <Box.Flex
                css={styles.optional}
                justify={'space-between'}
                align={'flex-end'}
              >
                <Form.Label htmlFor="feedback">
                  Let us know what we{' '}
                  {formData.helpful === true ? 'did well' : 'can do better'}
                </Form.Label>
                <Text>Optional</Text>
              </Box.Flex>
              <Box css={{ color: 'var(--colors-inputBaseColor) !important' }}>
                <textarea
                  style={styles.textarea}
                  className="form-textarea"
                  onChange={(e) =>
                    setFormData({ ...formData, feedback: e.target.value })
                  }
                  id="message"
                  name="message"
                  rows={4}
                  cols={50}
                />
              </Box>
            </Form.Control>

            <Form.Control css={styles.formControl}>
              <Box.Flex
                css={styles.optional}
                justify={'space-between'}
                align={'flex-end'}
              >
                <Form.Label htmlFor="email">
                  If we can contact you with questions, please enter your email
                </Form.Label>
                <Text>Optional</Text>
              </Box.Flex>
              <Input isFullWidth>
                <Input.ElementLeft element={<Icon icon="Mail" />} />
                <Input.Field
                  type="email"
                  id="email"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  name="email"
                  placeholder="email@example.com"
                />
              </Input>
            </Form.Control>
            <Box.Flex justify={'flex-end'} gap={'10px'}>
              <Button
                onPress={() => setFormData({ helpful: null })}
                variant="outlined"
                intent="base"
                size="sm"
                type="button"
              >
                Cancel
              </Button>
              <Button
                css={styles.submit}
                variant="outlined"
                intent="base"
                size="sm"
                type="submit"
              >
                Send
              </Button>
            </Box.Flex>
          </>
        )}
      </form>
      <Box
        css={{
          ...styles.alertContainer,
          bottom: status && alertMsg ? '20px' : '-100px',
        }}
      >
        {last && last.status && last.alert && (
          <Alert status={status ? status : last.status} direction="row">
            <Alert.Description>
              {alertMsg ? alertMsg : last.alert}
            </Alert.Description>
          </Alert>
        )}
      </Box>
    </Box>
  );
}

const styles = {
  formContainer: cssObj({
    padding: '8px 16px',
    border: '1px solid var(--colors-inputBaseBorder)',
    borderRadius: '6px',
    margin: '10px auto',
    width: '280px',
    '@sm': {
      width: 'auto',
      maxWidth: '80vw',
    },
  }),
  buttonLabel: cssObj({
    padding: '8px 16px',
    margin: 0,
    border: '1px solid var(--colors-inputBaseBorder)',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
  }),
  radioButton: cssObj({
    display: 'none',
  }),
  submit: cssObj({
    '&:hover': {
      backgroundColor: 'var(--colors-semanticSolidInfoBg) !important',
    },
  }),
  helpful: cssObj({
    backgroundColor: 'var(--colors-semanticSolidInfoBg)',
  }),
  notHelpful: cssObj({
    backgroundColor: 'var(--colors-semanticSolidErrorBg)',
  }),
  formControl: cssObj({
    marginBottom: '10px',
  }),
  optional: cssObj({
    fontSize: '$sm',
  }),
  forum: cssObj({
    fontSize: '$sm',
    margin: '10px 0',
  }),
  textarea: cssObj({
    maxWidth: '99%',
    minWidth: '99%',
    backgroundColor: 'var(--colors-inputBaseBg)',
    border: '1px solid var(--colors-inputBaseBorder)',
    outline: 'none',
    fontSize: 'var(--fontSizes-base)',
    fontFamily: 'var(--fonts-display)',
  }),
  alertContainer: cssObj({
    position: 'fixed',
    right: '20px',
    transition: 'bottom 0.25s ease',
  }),
};
