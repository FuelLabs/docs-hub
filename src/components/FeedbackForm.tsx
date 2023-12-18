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
  IconButton,
  Spinner,
} from '@fuel-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

type FormData = {
  helpful: 'true' | 'false' | null;
  feedback: string;
  email: string;
};

export function FeedbackForm() {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const isHelpful = watch('helpful');

  function closeForm() {
    setDialogIsOpen(false);
    reset();
  }

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
      closeForm();
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
          <Box
            as="input"
            type="radio"
            id="trueButton"
            value="true"
            checked={isHelpful === 'true'}
            {...register('helpful', { required: true })}
            css={styles.radioButton}
          />
          <Box
            as="label"
            css={
              isHelpful === 'true'
                ? {
                    ...styles.buttonLabel,
                    ...styles.helpful,
                  }
                : styles.buttonLabel
            }
            htmlFor="trueButton"
          >
            <Icon
              css={isHelpful === 'true' ? styles.selectedThumbIcon : {}}
              icon="ThumbUp"
            />
          </Box>
          <Box
            as="input"
            type="radio"
            id="falseButton"
            value="false"
            checked={isHelpful === 'false'}
            {...register('helpful', { required: true })}
            css={styles.radioButton}
          />
          <Box
            as="label"
            css={
              isHelpful === 'false'
                ? {
                    ...styles.buttonLabel,
                    ...styles.notHelpful,
                  }
                : styles.buttonLabel
            }
            htmlFor="falseButton"
          >
            <Icon
              css={isHelpful === 'false' ? styles.selectedThumbIcon : {}}
              icon="ThumbDown"
            />
          </Box>
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
          <Form.Label css={styles.text} htmlFor="feedback">
            Let us know what we{' '}
            {isHelpful === 'true' ? 'did well' : 'can do better'}
          </Form.Label>
          <Text css={styles.text}>Optional</Text>
        </Box.Flex>
        <Box css={styles.textareaContainer}>
          <Box
            as="textarea"
            css={styles.textarea}
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
          <Form.Label css={styles.text} htmlFor="email">
            If we can contact you with questions, please enter your email
          </Form.Label>
          <Text css={styles.text}>Optional</Text>
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
        <Button
          variant="outlined"
          intent="base"
          size="sm"
          type="button"
          onClick={() => closeForm()}
          css={styles.text}
        >
          Cancel
        </Button>
        <Button
          css={{ ...styles.text, ...styles.submit }}
          variant="outlined"
          intent="base"
          size="sm"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          {mutation.isLoading ? (
            <Spinner color="semanticSolidInfoBg" />
          ) : (
            'Send'
          )}
        </Button>
      </Box.Flex>
    );
  }

  return (
    <Box>
      <Dialog isOpen={dialogIsOpen} onOpenChange={setDialogIsOpen}>
        <Box.Flex align="center" gap={'6px'} css={styles.container}>
          <IconButton
            aria-label="Thumbs Up"
            icon="ThumbUp"
            size="sm"
            intent="base"
            variant="ghost"
            css={styles.ratingButton}
            onClick={() => {
              setDialogIsOpen(true);
              setValue('helpful', 'true');
            }}
          />
          <IconButton
            aria-label="Thumbs Down"
            icon="ThumbDown"
            size="sm"
            intent="base"
            variant="ghost"
            css={styles.ratingButton}
            onClick={() => {
              setDialogIsOpen(true);
              setValue('helpful', 'false');
            }}
          />
          <Text css={styles.text}>Was this page helpful?</Text>
        </Box.Flex>
        <Dialog.Content>
          <Dialog.Close onClick={closeForm} />
          <Dialog.Heading>Was this page helpful?</Dialog.Heading>
          <form>
            <HelpfulButtons />
            {isHelpful === 'false' && (
              <Form.HelperText css={{ ...styles.text, ...styles.forum }}>
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
    </Box>
  );
}

const styles = {
  text: cssObj({
    'html[class="fuel_light-theme"] &': {
      color: '$intentsBase12',
    },
  }),
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
  }),
  radioButton: cssObj({
    display: 'none',
  }),
  submit: cssObj({
    '&:hover': {
      backgroundColor: '$semanticSolidInfoBg !important',
      'html[class="fuel_light-theme"] &': {
        color: '$gray6',
      },
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
  selectedThumbIcon: cssObj({
    'html[class="fuel_light-theme"] &': {
      color: '$gray6',
    },
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
    maxHeight: '200px',
    padding: '10px',
    backgroundColor: 'var(--colors-inputBaseBg)',
    border: '1px solid var(--colors-inputBaseBorder)',
    outline: 'none',
    fontSize: 'var(--fontSizes-base)',
    fontFamily: 'var(--fonts-display)',
  }),
  container: cssObj({
    justifyContent: 'center',
    '@sm': {
      justifyContent: 'flex-start',
    },
  }),
};
