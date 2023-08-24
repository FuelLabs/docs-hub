import { cssObj } from '@fuel-ui/css';
import { Form, Input, Icon, Button, Box, Text, Link } from '@fuel-ui/react';
import type { FormEvent } from 'react';
import { useState } from 'react';

interface FormData {
  helpful: boolean | null;
  feedback?: string;
  email?: string;
}

export function FeedbackForm() {
  const [formData, setFormData] = useState<FormData>({ helpful: null });

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
        alert('Data sent successfully.');
      } else {
        alert('Error sending data.');
      }
    } catch (error) {
      console.error('There was an error sending the data', error);
    }
  };

  return (
    <Box css={styles.formContainer}>
      <form style={styles.form} onSubmit={handleSubmit}>
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
              <textarea
                style={styles.textarea}
                className="form-textarea"
                id="message"
                name="message"
                rows={4}
                cols={50}
              />
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
                type="button"
              >
                Cancel
              </Button>
              <Button
                css={styles.submit}
                variant="outlined"
                intent="base"
                type="submit"
              >
                Send
              </Button>
            </Box.Flex>
          </>
        )}
      </form>
    </Box>
  );
}

const styles = {
  formContainer: cssObj({
    padding: '8px 16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    margin: '10px auto',
    width: '280px',
    '@sm': {
      width: 'auto',
    },
  }),
  buttonLabel: cssObj({
    padding: '8px 16px',
    margin: 0,
    border: '1px solid #ccc',
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
    color: 'var(--colors-inputBaseColor)',
    outline: 'none',
  }),
};
