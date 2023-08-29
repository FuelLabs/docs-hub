import { cssObj } from '@fuel-ui/css';
import {
  Form,
  Input,
  Icon,
  Button,
  Box,
  Text,
  Link,
  Dialog,
  toast,
  Alert,
} from '@fuel-ui/react';
import { useMutation } from '@tanstack/react-query';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

type FormData = {
  helpful: 'true' | 'false' | null;
  feedback: string;
  email: string;
};

export function FeedbackForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const isHelpful = watch('helpful');

  const submitForm = (data: FormData) => {
    return fetch('/api/airtable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  const mutation = useMutation(submitForm, {
    onSuccess: async () => {
      toast.success('Submitted! Thank you for your feedback.');
      reset();
    },
    onError: async () => {
      toast.error('Oops! Something went wrong.');
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutation.mutate(data);
  };

  function HelpfulButtons() {
    return (
      <Form.Control css={styles.formControl} isRequired>
        <Box.Flex gap={'8px'}>
          <input
            type="radio"
            id="trueButton"
            value="true"
            checked={isHelpful === 'true'}
            {...register('helpful', { required: true })}
            style={styles.radioButton}
          />
          <label
            style={
              isHelpful === 'true'
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
            value="false"
            checked={isHelpful === 'false'}
            {...register('helpful', { required: true })}
            style={styles.radioButton}
          />
          <label
            style={
              isHelpful === 'false'
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
        {errors.helpful && (
          <Alert css={styles.alert} direction="row" status="error">
            <Alert.Description>A rating is required.</Alert.Description>
          </Alert>
        )}
      </Form.Control>
    );
  }

  function Feedback() {
    return (
      <Form.Control css={styles.formControl}>
        <Box.Flex
          css={styles.optional}
          justify={'space-between'}
          align={'flex-end'}
        >
          <Form.Label htmlFor="feedback">
            Let us know what we{' '}
            {isHelpful === 'true' ? 'did well' : 'can do better'}
          </Form.Label>
          <Text>Optional</Text>
        </Box.Flex>
        <Box css={styles.textareaContainer}>
          <textarea
            style={styles.textarea}
            className="form-textarea"
            id="message"
            rows={4}
            cols={50}
            {...register('feedback')}
          />
        </Box>
      </Form.Control>
    );
  }

  function Email() {
    return (
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
            {...register('email')}
            placeholder="email@example.com"
          />
        </Input>
      </Form.Control>
    );
  }

  function Submit() {
    return (
      <Box.Flex justify={'flex-end'} gap={'10px'}>
        <Dialog.Close asChild>
          <Button variant="outlined" intent="base" size="sm" type="button">
            Cancel
          </Button>
        </Dialog.Close>
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
    );
  }

  return (
    <>
      <Dialog
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            reset();
          }
        }}
      >
        <Box.Flex align="center" gap={'6px'}>
          <Dialog.Trigger>
            <Button
              size="sm"
              intent="base"
              variant="ghost"
              css={styles.ratingButton}
            >
              <Box
                css={styles.ratingBox}
                onClick={() => setValue('helpful', 'true')}
              >
                <Icon icon="ThumbUp" />
              </Box>
            </Button>
          </Dialog.Trigger>
          <Dialog.Trigger>
            <Button
              size="sm"
              intent="base"
              variant="ghost"
              css={styles.ratingButton}
            >
              <Box
                css={styles.ratingBox}
                onClick={() => setValue('helpful', 'false')}
              >
                <Icon icon="ThumbDown" />
              </Box>
            </Button>
          </Dialog.Trigger>
          <Text>Was this page helpful?</Text>
        </Box.Flex>
        <Dialog.Content>
          <Dialog.Close />
          <Dialog.Heading>Was this page helpful?</Dialog.Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HelpfulButtons />
            {isHelpful === 'false' && (
              <Form.HelperText css={styles.forum}>
                If you need support, please create a post in our{' '}
                <Link
                  css={styles.forumLink}
                  isExternal
                  href="https://forum.fuel.network/"
                >
                  Forum
                </Link>
                .
              </Form.HelperText>
            )}
            <Feedback />
            <Email />
            <Submit />
          </form>
        </Dialog.Content>
      </Dialog>
    </>
  );
}

const styles = {
  buttonLabel: cssObj({
    padding: '8px 16px',
    margin: 0,
    border: '1px solid var(--colors-inputBaseBorder)',
    cursor: 'pointer',
    borderRadius: '6px',
  }),
  ratingButton: cssObj({
    border: '1px solid $inputBaseBorder',
    background: 'transparent',
    padding: 0,
  }),
  ratingBox: cssObj({
    padding: '4px 12px',
  }),
  radioButton: cssObj({
    display: 'none',
  }),
  submit: cssObj({
    '&:hover': {
      backgroundColor: '$semanticSolidInfoBg !important',
    },
  }),
  helpful: cssObj({
    backgroundColor: 'var(--colors-semanticSolidInfoBg)',
  }),
  notHelpful: cssObj({
    backgroundColor: 'var(--colors-semanticSolidErrorBg)',
  }),
  formControl: cssObj({
    marginBottom: '$3',
  }),
  optional: cssObj({
    fontSize: '$sm',
  }),
  alert: cssObj({
    fontSize: '$sm',
  }),
  forum: cssObj({
    fontSize: '$sm',
    margin: '$2 0',
  }),
  forumLink: cssObj({
    textDecoration: 'underline',
    color: '$intentsBase11',
  }),
  textareaContainer: cssObj({
    color: '$inputBaseColor !important',
  }),
  textarea: cssObj({
    maxWidth: '95.5%',
    minWidth: '95.5%',
    padding: '10px',
    backgroundColor: 'var(--colors-inputBaseBg)',
    border: '1px solid var(--colors-inputBaseBorder)',
    outline: 'none',
    fontSize: 'var(--fontSizes-base)',
    fontFamily: 'var(--fonts-display)',
  }),
};
