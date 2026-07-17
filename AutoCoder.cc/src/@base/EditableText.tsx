'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

interface EditableTextProps {
    className?: string; // 自定义类名
    propKey?: string; // 可选的 propKey，用于标识
    children?: string; // 初始文本内容
}

const EditableText: React.FC<EditableTextProps & React.HTMLAttributes<HTMLDivElement>> = ({
    propKey,
    className,
    children = "",
    ...rest
}) => {
    const [text, setText] = useState<string>("");
    const [link, setLink] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const router = useRouter();

    // 关键：监听 children 变化，自动同步 text
    useEffect(() => {
        let temp_text =children
        if (typeof children !== 'string') {
            // 这里建议加个类型保护
            // @ts-ignore
            temp_text = children[0] || '';
        }

        if(temp_text.includes("&")){
            const params = new URLSearchParams(temp_text);
            const text_param = params.get('text'); 
            const link_param = params.get('link'); 
            const new_text = text_param ? text_param : temp_text.split("&")[0];
            setText(new_text);
            setLink(link_param ? link_param : "");
        }
        else
        {
            setText(temp_text);
        }
    }, [children]);

    return isEditing ? (
        <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="border-b border-gray-400 focus:outline-none"
        />
    ) : (
        <div
            key={propKey}
            onClick={(_) => {
                if (link) {
                    console.log("naviaget to ", link)
                    router.push(link);
                }
            }}
            className={className}
            style={{ cursor: link ? "pointer" : "" }}
            data-link={link}
            {...rest}
        >
            {text}
        </div>
    );
};

export default EditableText;
