import { startTransition, type FormEvent } from "react";

/**
 * onSubmit for a form driven by useActionState. React resets a form after
 * an `action={...}` submit, even when the server answers with an error, so
 * a wrong password or a taken login would wipe everything typed. Submitting
 * through this handler skips that reset; the form keeps `action` as the
 * no-JavaScript fallback. Clear the form yourself on success if needed.
 */
export function keepValues(dispatch: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const formData = new FormData(event.currentTarget, submitter);
    startTransition(() => dispatch(formData));
  };
}
