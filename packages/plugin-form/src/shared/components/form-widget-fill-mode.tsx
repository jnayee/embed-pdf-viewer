import { useCallback, useEffect, useMemo, useState } from '@framework';
import {
  PDF_FORM_FIELD_FLAG,
  PDF_FORM_FIELD_TYPE,
  PdfWidgetAnnoField,
  PdfWidgetAnnoObject,
} from '@embedpdf/models';
import { AnnotationRendererProps } from '@embedpdf/plugin-annotation/@framework';
import { useFormCapability } from '../hooks/use-form';
import { RenderWidget } from './render-widget';
import { TextField } from './fields/text';
import { ComboboxField } from './fields/combobox';
import { PushButtonField } from './fields/push-button';
import { TextFieldProps, ComboboxFieldProps, PushButtonFieldProps } from './types';

function isToggleType(type: PDF_FORM_FIELD_TYPE): boolean {
  return type === PDF_FORM_FIELD_TYPE.CHECKBOX || type === PDF_FORM_FIELD_TYPE.RADIOBUTTON;
}

export function FormWidgetFillMode(props: AnnotationRendererProps<PdfWidgetAnnoObject>) {
  const { currentObject: annotation, scale, pageIndex } = props;
  const field = annotation.field;
  const { provides: formProvides } = useFormCapability();
  const [editing, setEditing] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  const isReadOnly = !!(field.flag & PDF_FORM_FIELD_FLAG.READONLY);

  const scope = useMemo(
    () => formProvides?.forDocument(props.documentId),
    [formProvides, props.documentId],
  );

  useEffect(() => {
    if (!scope) return;
    return scope.onFieldValueChange((event) => {
      if (event.annotationId === annotation.id) {
        setRenderKey((k) => k + 1);
      }
    });
  }, [scope, annotation.id]);

  const handleChangeField = useCallback(
    (newField: PdfWidgetAnnoField) => {
      if (!scope) return;
      scope.setFormFieldValues(pageIndex, annotation, newField).wait(
        () => {},
        () => {},
      );
    },
    [scope, pageIndex, annotation],
  );

  const handleClick = useCallback(() => {
    if (isReadOnly) return;

    if (isToggleType(field.type) && 'isChecked' in field) {
      handleChangeField({ ...field, isChecked: !field.isChecked } as PdfWidgetAnnoField);
      return;
    }

    setEditing(true);
  }, [isReadOnly, field, handleChangeField]);

  const handleBlur = useCallback(() => {
    setEditing(false);
  }, []);

  const focusRef = useCallback((el: HTMLElement | null) => {
    if (el) {
      el.focus();
      if (el instanceof HTMLSelectElement) {
        try {
          el.showPicker();
        } catch {
          /* older browsers */
        }
      }
    }
  }, []);

  const common = {
    annotation,
    scale,
    pageIndex,
    isEditable: true,
    onBlur: handleBlur,
    inputRef: undefined as undefined | ((el: HTMLElement | null) => void),
  };

  let content = null;
  switch (field.type) {
    case PDF_FORM_FIELD_TYPE.TEXTFIELD:
      content = (
        <TextField
          {...common}
          annotation={annotation as TextFieldProps['annotation']}
          onChangeField={handleChangeField}
          inputRef={focusRef}
        />
      );
      break;
    case PDF_FORM_FIELD_TYPE.COMBOBOX:
    case PDF_FORM_FIELD_TYPE.LISTBOX:
      content = (
        <ComboboxField
          {...common}
          annotation={annotation as ComboboxFieldProps['annotation']}
          onChangeField={handleChangeField}
          inputRef={focusRef}
        />
      );
      break;
    case PDF_FORM_FIELD_TYPE.PUSHBUTTON:
      content = (
        <PushButtonField
          {...common}
          annotation={annotation as PushButtonFieldProps['annotation']}
        />
      );
      break;
    default:
      break;
  }

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: isReadOnly ? 'default' : 'pointer',
        pointerEvents: 'auto',
      }}
    >
      {!editing && (
        <RenderWidget
          pageIndex={pageIndex}
          annotation={annotation}
          scaleFactor={scale}
          renderKey={renderKey}
          style={{ pointerEvents: 'none' }}
        />
      )}
      {editing && content}
    </div>
  );
}
