/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ReactElement } from "react"
import { DownloadButton as DownloadButtonProto } from "src/lib/proto"
import BaseButton, {
  BaseButtonTooltip,
  BaseButtonKind,
  BaseButtonSize,
} from "src/lib/components/shared/BaseButton"
import { WidgetStateManager } from "src/lib/WidgetStateManager"
import StreamlitMarkdown from "src/lib/components/shared/StreamlitMarkdown"
import { StreamlitEndpoints } from "src/lib/StreamlitEndpoints"
import { useStliteKernel, downloadFileFromStlite } from "@stlite/kernel"

export interface Props {
  endpoints: StreamlitEndpoints
  disabled: boolean
  element: DownloadButtonProto
  widgetMgr: WidgetStateManager
  width: number
}

function DownloadButton(props: Props): ReactElement {
  const { disabled, element, widgetMgr, width, endpoints } = props
  const style = { width }

  const stliteKernel = useStliteKernel()

  const handleDownloadClick: () => void = () => {
    // Downloads are only done on links, so create a hidden one and click it
    // for the user.
    widgetMgr.setTriggerValue(element, { fromUi: true })

    if (element.url.startsWith("/media")) {
      downloadFileFromStlite(stliteKernel, element.url)
      return
    }

    const link = document.createElement("a")
    const uri = endpoints.buildMediaURL(element.url)
    link.setAttribute("href", uri)
    link.setAttribute("target", "_blank")
    link.click()
  }

  return (
    <div className="row-widget stDownloadButton" style={style}>
      <BaseButtonTooltip help={element.help}>
        <BaseButton
          kind={BaseButtonKind.SECONDARY}
          size={BaseButtonSize.SMALL}
          disabled={disabled}
          onClick={handleDownloadClick}
          fluidWidth={element.useContainerWidth || false}
        >
          <StreamlitMarkdown
            source={element.label}
            allowHTML={false}
            isLabel
            isButton
          />
        </BaseButton>
      </BaseButtonTooltip>
    </div>
  )
}

export default DownloadButton