import { useState } from 'react';
import { IPiaForm } from '../../../../types/interfaces/pia-form.interface';
import ViewReviewSection from './viewReviewSection';
import { getGUID } from '../../../../utils/user';
import messages from './messages';
import { getUserPrivileges } from '../../../../utils/statusList/common';

interface ICPOReviewProps {
  pia: IPiaForm;
  printPreview?: boolean;
  cpoId: string;
  stateChangeHandler: (value: any, path: string, callApi?: boolean) => void;
}

const ViewCPOReview = (props: ICPOReviewProps) => {
  const { pia, printPreview, stateChangeHandler, cpoId } = props;
  const reviewedByDisplayName = Object(props.pia?.review?.cpo)?.[cpoId]
    .reviewedByDisplayName;

  const reviewedAt = Object(props.pia?.review?.cpo)?.[cpoId].reviewedAt;
  const reviewGuid = Object(props.pia?.review?.cpo)?.[cpoId].reviewedByGuid;

  /**
   * Local state for the checkbox and review note
   */
  const [acknowledged, setAcknowledged] = useState(
    Object(pia.review?.cpo)?.[cpoId]?.isAcknowledged || false,
  );
  const [reviewNote, setReviewNote] = useState(
    Object(pia.review?.cpo)?.[cpoId].reviewNote || '',
  );
  const [editReviewNote, setEditReviewNote] = useState(false);
  const handleSubmit = () => {
    const review = { isAcknowledged: acknowledged, reviewNote };
    stateChangeHandler(review, `cpo.${cpoId}`, true);
  };
  const handleClear = () => {
    stateChangeHandler(null, `cpo.${cpoId}`, true);
  };

  const canEditReview =
    reviewGuid === getGUID() &&
    !printPreview &&
    (getUserPrivileges(pia)?.Pages?.review?.params?.editCpoReview ?? false);

  return (
    <div className="d-grid gap-3">
      {printPreview ? (
        <div>
          {Object(pia?.review?.cpo)?.[cpoId]?.isAcknowledged === false ? (
            <div className="row mb-5 p-3 pb-5 border border-2 rounded">
              <div> Reviewed by</div>
              <div> Review incomplete</div>
            </div>
          ) : (
            <div>
              <ViewReviewSection
                pia={pia}
                printPreview
                isAcknowledged={acknowledged}
                canEditReview={canEditReview}
                editReviewNote={editReviewNote}
                setEditReviewNote={setEditReviewNote}
                setAcknowledged={setAcknowledged}
                setReviewNote={setReviewNote}
                reviewedByDisplayName={reviewedByDisplayName}
                reviewNote={reviewNote}
                reviewedAtTime={reviewedAt}
                checkBoxLabel={
                  messages.PiaReviewHeader.MinistrySection.CPO.Input
                    .AcceptAccountability.en
                }
                onClearClick={handleClear}
                onConfirmClick={handleSubmit}
              />
            </div>
          )}
        </div>
      ) : (
        <ViewReviewSection
          pia={pia}
          isAcknowledged={acknowledged}
          canEditReview={canEditReview}
          editReviewNote={editReviewNote}
          setEditReviewNote={setEditReviewNote}
          setAcknowledged={setAcknowledged}
          setReviewNote={setReviewNote}
          reviewedByDisplayName={reviewedByDisplayName}
          reviewNote={reviewNote}
          reviewedAtTime={reviewedAt}
          checkBoxLabel={
            messages.PiaReviewHeader.MinistrySection.CPO.Input
              .AcceptAccountability.en
          }
          onClearClick={handleClear}
          onConfirmClick={handleSubmit}
        />
      )}
    </div>
  );
};

export default ViewCPOReview;
